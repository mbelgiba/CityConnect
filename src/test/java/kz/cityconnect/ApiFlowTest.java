package kz.cityconnect;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:cityconnect-tests;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE",
        "spring.datasource.username=sa",
        "spring.datasource.password="
})
@AutoConfigureMockMvc
class ApiFlowTest {
    @Autowired MockMvc mvc;
    @Autowired ObjectMapper mapper;

    @Test
    void registrationCommunityReportsCommentsVotesAndValidationWork() throws Exception {
        String suffix = UUID.randomUUID().toString().substring(0, 8);
        String username = "citizen_" + suffix;
        String email = username + "@example.test";
        String password = "Correct-Horse-2026!";

        MvcResult registration = mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("fullName", "Test Citizen", "username", username, "email", email, "password", password)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user.role").value("CITIZEN"))
                .andExpect(jsonPath("$.user.fullName").value("Test Citizen"))
                .andReturn();
        String token = mapper.readTree(registration.getResponse().getContentAsString()).get("token").asText();

        mvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("fullName", "Duplicate", "username", username, "email", "other_" + suffix + "@example.test", "password", password)))
                .andExpect(status().isConflict());

        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json("username", username, "password", password)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username").value(username));

        mvc.perform(post("/api/incidents").header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("title", "A test streetlight", "description", "The light is not working.", "category", "Street lighting", "location", "Test Avenue")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("NEW"))
                .andExpect(jsonPath("$.createdBy").value(username));

        MvcResult listResult = mvc.perform(get("/api/incidents").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("A test streetlight"))
                .andReturn();
        JsonNode reports = mapper.readTree(listResult.getResponse().getContentAsString());
        long incidentId = reports.get(0).get("id").asLong();

        mvc.perform(patch("/api/incidents/{id}", incidentId).header("Authorization", bearer(token))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json("title", "Updated test streetlight", "description", "The light still needs repair.", "category", "Street lighting", "location", "Test Avenue")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated test streetlight"));
        mvc.perform(get("/api/incidents").param("q", "updated test").param("size", "10").header("Authorization", bearer(token)))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].title").value("Updated test streetlight"));
        mvc.perform(get("/api/incidents/{id}/history", incidentId).header("Authorization", bearer(token)))
                .andExpect(status().isOk()).andExpect(jsonPath("$[0].toStatus").value("NEW"));
        mvc.perform(get("/api/notifications").header("Authorization", bearer(token)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.unreadCount").value(0));

        mvc.perform(post("/api/incidents/{id}/comments", incidentId)
                        .header("Authorization", bearer(token)).contentType(MediaType.APPLICATION_JSON)
                        .content(json("body", "Thanks for looking into this.")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.author").value(username));
        mvc.perform(get("/api/incidents/{id}/comments", incidentId).header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].body").value("Thanks for looking into this."));

        mvc.perform(put("/api/incidents/{id}/vote", incidentId).header("Authorization", bearer(token)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.voteCount").value(1));
        mvc.perform(put("/api/incidents/{id}/vote", incidentId).header("Authorization", bearer(token)))
                .andExpect(status().isOk()).andExpect(jsonPath("$.voteCount").value(1));
        mvc.perform(get("/api/incidents").header("Authorization", bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].commentCount").value(1))
                .andExpect(jsonPath("$[0].votedByMe").value(true));

        mvc.perform(patch("/api/incidents/{id}/status", incidentId)
                        .header("Authorization", bearer(token)).contentType(MediaType.APPLICATION_JSON)
                        .content(json("status", "IN_PROGRESS")))
                .andExpect(status().isForbidden());
        mvc.perform(post("/api/incidents/{id}/comments", incidentId)
                        .header("Authorization", bearer(token)).contentType(MediaType.APPLICATION_JSON)
                        .content(json("body", "   ")))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));

    }

    private String bearer(String token) { return "Bearer " + token; }

    private String json(String... pairs) throws Exception {
        var values = new java.util.LinkedHashMap<String, String>();
        for (int i = 0; i < pairs.length; i += 2) values.put(pairs[i], pairs[i + 1]);
        return mapper.writeValueAsString(values);
    }
}
