const API = '/api';
const CATEGORIES = [
  'Roads and sidewalks', 'Street lighting', 'Waste and cleanliness',
  'Water and drainage', 'Parks and public spaces', 'Other'
];
const STATUSES = ['NEW', 'UNDER_REVIEW', 'ACCEPTED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED'];
const LANGUAGES = {
  en: { name: 'English' },
  ru: { name: 'Русский', map: {
    'Your city, a little better every day':'Ваш город становится лучше каждый день', 'Sign in':'Войти', 'Create account':'Создать аккаунт',
    'My workspace':'Мой кабинет', 'Sign out':'Выйти', 'Small reports.':'Небольшие обращения.', 'Real change.':'Реальные перемены.',
    'A clearer way to let your city know what needs attention. Share a local issue, follow its progress, and help your neighborhood move forward.':'Простой способ сообщить городу о проблеме, следить за её решением и улучшать свой район.',
    'Report an issue':'Сообщить о проблеме', 'Already a member?':'Уже зарегистрированы?', 'A better city starts nearby':'Перемены начинаются рядом',
    'Every clear report helps teams take action.':'Чёткое обращение помогает городским службам действовать.', 'Simple by design':'Ничего лишнего',
    'From “someone should”':'От слов «кто-нибудь должен»', 'to “it’s taken care of.”':'к реальному решению.',
    'Everything your report needs, gathered in one clear place.':'Всё для вашего обращения — в одном понятном месте.',
    'Point it out':'Укажите проблему', 'Describe the issue and tell us where to find it.':'Опишите проблему и укажите её место.',
    'Follow along':'Следите за ходом', 'See your report move through each status.':'Наблюдайте за изменением статуса обращения.',
    'See the progress':'Увидьте результат', 'City teams update the report as work gets done.':'Городские службы обновляют обращение по мере работы.',
    'Your neighborhood is worth it':'Ваш район заслуживает заботы', "Let's make the next little thing better.":'Давайте вместе улучшим ещё одну деталь.', 'Get started':'Начать',
    'Made for a city that keeps getting better.':'Для города, который становится лучше.', 'Member sign in ↗':'Войти в аккаунт ↗',
    '← Back to CityConnect':'← На главную CityConnect', 'A little care goes a long way.':'Немного заботы меняет многое.',
    'Report local issues and keep track as they get resolved.':'Сообщайте о проблемах и следите за их решением.', 'Better neighborhoods, together.':'Улучшаем районы вместе.',
    'Welcome to your community':'Добро пожаловать в сообщество', 'Good things start with a hello.':'Хорошие перемены начинаются со знакомства.',
    'Good to have you back.':'Рады видеть вас снова.', 'Create an account to share a concern and follow it all the way through.':'Создайте аккаунт, чтобы сообщать о проблемах и следить за их решением.',
    'Your reports and city updates are right where you left them.':'Ваши обращения и обновления города уже здесь.', 'CityConnect account':'Аккаунт CityConnect',
    'Create your account':'Создать аккаунт', 'Welcome back':'С возвращением', 'Join your neighbors and help improve your city.':'Присоединяйтесь к соседям и помогайте улучшать город.',
    'Sign in to follow your reports and city updates.':'Войдите, чтобы следить за обращениями и обновлениями города.', 'Email address':'Электронная почта', 'Username':'Имя пользователя',
    'Password':'Пароль', 'Use at least 10 characters.':'Используйте не менее 10 символов.', 'At least 10 characters':'Не менее 10 символов',
    'Your password':'Ваш пароль', 'Already have an account?':'Уже есть аккаунт?', 'New to CityConnect?':'Впервые в CityConnect?', 'A thoughtful way to help your city move forward.':'Помогаем городу двигаться вперёд.',
    'City administration':'Администрация города', 'City team workspace':'Кабинет городской службы', 'Your neighborhood workspace':'Кабинет вашего района',
    'Here’s what’s happening across the community today.':'Вот что происходит в городе сегодня.', 'Here’s a little snapshot of the change you’re helping create.':'Вот как меняется город благодаря вашему участию.',
    'Manage roles':'Управление ролями', 'New report':'Новое обращение', 'All reports':'Все обращения', 'Across the community':'По всему городу',
    'Submitted by you':'Созданы вами', 'Needs attention':'Требуют внимания', 'Still moving through the process':'Ещё в работе', 'In progress':'В работе',
    'Being worked on right now':'Обрабатываются сейчас', 'Resolved':'Решены', 'Closed with a positive outcome':'Успешно завершены', 'Community pulse':'Пульс города',
    'Your activity':'Ваша активность', 'Latest reports':'Последние обращения', 'Your reports':'Мои обращения', 'All statuses':'Все статусы',
    'A little perspective':'Коротко о главном', 'of your reports have been resolved':'ваших обращений решены', 'can start a real change':'может начать перемены',
    'resolved':'решено', 'still active':'ещё в работе', 'Report categories':'Категории обращений', 'Your first report will bring this snapshot to life.':'Первое обращение наполнит эту сводку данными.',
    'A helpful detail':'Полезный совет', 'A clear status update helps residents understand what happens next.':'Обновлённый статус помогает жителям понимать, что происходит.',
    'Add a nearby landmark to help the city team find the issue faster.':'Укажите ориентир поблизости, чтобы служба быстрее нашла место.',
    'Showing':'Показано', 'of':'из', 'reports':'обращений', 'A good place to begin':'Хорошее начало', 'Your first report can make a difference.':'Ваше первое обращение может изменить ситуацию.',
    'Street light out? Sidewalk needs care? Let your city know and keep an eye on the progress.':'Не горит фонарь? Нужен ремонт тротуара? Сообщите городу и следите за решением.',
    'Create your first report':'Создать первое обращение', 'Update progress':'Изменить статус', 'Save update':'Сохранить', 'A clear report goes a long way':'Точное обращение помогает делу',
    'Tell us what':'Расскажите,', 'needs attention.':'что требует внимания.', 'Share a few details so the right city team can understand the issue and take a closer look.':'Добавьте детали, чтобы нужная городская служба поняла проблему и смогла её проверить.',
    'Your report is saved securely to your account.':'Обращение будет сохранено в вашем аккаунте.', 'Describe the issue':'Опишите проблему', 'Start with the detail that matters most.':'Начните с самого важного.',
    'Issue title':'Краткое название', 'A little more detail':'Подробности', 'What happened? When did you notice it? Any detail that could help the city team?':'Что произошло? Когда вы заметили проблему? Какие детали помогут службе?',
    'A few clear sentences are usually enough.':'Обычно достаточно нескольких точных предложений.', 'Help us locate it':'Укажите место', 'Choose a category and add a nearby location.':'Выберите категорию и укажите адрес.',
    'Category':'Категория', 'Choose category':'Выберите категорию', 'Location':'Место', 'Street, area or landmark':'Улица, район или ориентир',
    'Include a street name, building, or landmark so the team can find the spot.':'Укажите улицу, здание или ориентир, чтобы служба нашла это место.',
    'Submit report':'Отправить обращение', 'By submitting, you confirm these details are accurate to the best of your knowledge.':'Отправляя обращение, вы подтверждаете точность сведений.',
    'People make the city.':'Город создают люди.', 'Manage team access and community roles from one place.':'Управляйте доступом сотрудников и ролями в одном месте.', 'Save role':'Сохранить роль',
    'Gathering your city updates…':'Загружаем обновления города…', 'We couldn’t load your reports':'Не удалось загрузить обращения', "We couldn't load your reports":'Не удалось загрузить обращения', 'Try again':'Повторить',
    'No reports with this status':'Нет обращений с таким статусом', 'Choose another status to see more updates.':'Выберите другой статус, чтобы увидеть обращения.',
    'Report status updated.':'Статус обращения обновлён.', 'Report submitted. Thank you for speaking up.':'Обращение отправлено. Спасибо, что не остались в стороне.',
    'Role updated.':'Роль обновлена.', 'Please check the submitted fields':'Проверьте заполненные поля', 'The request body is missing or malformed':'Запрос пуст или имеет неверный формат',
    'This change conflicts with existing data. Refresh and try again.':'Эти данные уже существуют. Обновите страницу и попробуйте снова.',
    'Please sign in and try again':'Войдите в аккаунт и попробуйте снова', 'You do not have permission to perform this action':'У вас нет прав для этого действия',
    'Something went wrong. Please try again.':'Что-то пошло не так. Попробуйте ещё раз.', 'Username or email is already registered':'Имя пользователя или почта уже зарегистрированы',
    'Invalid username or password':'Неверное имя пользователя или пароль', 'Staff role required':'Требуется роль сотрудника', 'Unknown status':'Неизвестный статус', 'Unknown role':'Неизвестная роль',
    'NEW':'НОВОЕ', 'UNDER REVIEW':'НА ПРОВЕРКЕ', 'ACCEPTED':'ПРИНЯТО', 'IN PROGRESS':'В РАБОТЕ', 'RESOLVED':'РЕШЕНО', 'REJECTED':'ОТКЛОНЕНО', 'CLOSED':'ЗАКРЫТО',
    'CITIZEN':'ЖИТЕЛЬ', 'EMPLOYEE':'СОТРУДНИК', 'ADMIN':'АДМИНИСТРАТОР', 'Roads and sidewalks':'Дороги и тротуары', 'Street lighting':'Уличное освещение',
    'Waste and cleanliness':'Мусор и чистота', 'Water and drainage':'Вода и водоотведение', 'Parks and public spaces':'Парки и общественные места', 'Other':'Другое',
    'Comment':'Комментарий', 'Comments':'Комментарии', 'Add a comment':'Добавить комментарий', 'Write a helpful update…':'Напишите полезный комментарий…', 'Post comment':'Опубликовать',
    'Vote':'Поддержать', 'Voted':'Поддержано', 'Report support':'Поддержка', 'No comments yet. Start the conversation.':'Комментариев пока нет. Начните обсуждение.', 'Comment added.':'Комментарий добавлен.', 'You can vote only once.':'Можно проголосовать только один раз.',
    'Full name':'Имя и фамилия', 'Your name':'Ваше имя', 'Account created. Welcome to CityConnect!':'Аккаунт создан. Добро пожаловать в CityConnect!',
    'Password must contain at least 10 characters.':'Пароль должен содержать не менее 10 символов.', 'Please check the form and try again.':'Проверьте форму и попробуйте снова.',
    'Good morning':'Доброе утро', 'Good afternoon':'Добрый день', 'Good evening':'Добрый вечер', 'of community reports have been resolved':'городских обращений решено', 'Community reports':'Обращения жителей',
    'Report details':'Подробности обращения', 'Thank this resident':'Поддержать жителя', 'Loading comments…':'Загружаем комментарии…', 'Could not load comments.':'Не удалось загрузить комментарии.', 'You need an account to participate.':'Войдите, чтобы участвовать.', 'Full name':'Имя и фамилия', 'Your name':'Ваше имя', 'Account created. Welcome to CityConnect!':'Аккаунт создан. Добро пожаловать в CityConnect!',
    'Show comments':'Показать комментарии', 'Hide comments':'Скрыть комментарии', 'Vote':'Поддержать', 'Voted':'Поддержано', 'Post comment':'Опубликовать', 'Comments':'Комментарии', 'Comment added.':'Комментарий добавлен.', 'The requested item could not be found':'Не удалось найти запрошенную запись',
    'New report nearby':'Рядом появилось обращение', 'Street lighting · just now':'Уличное освещение · только что', 'Issue resolved':'Проблема решена', 'One more neighborhood win':'Ещё одна победа района',
    'One report':'Одно обращение', 'Sending your report…':'Отправляем обращение…', 'Your username':'Ваше имя пользователя', 'you@example.com':'you@example.com',
    'Username or email is already registered':'Имя пользователя или адрес почты уже зарегистрированы', 'Request failed':'Не удалось выполнить запрос',
    'Filter reports by status':'Фильтр обращений по статусу', 'Save role':'Сохранить роль', 'Role for':'Роль пользователя', 'Details':'Подробности', 'Language':'Язык', 'CityConnect — Your city, a little better every day':'CityConnect — город становится лучше каждый день', 'Sign in →':'Войти →',
    'Edit profile':'Профиль', 'Your profile':'Ваш профиль', 'Update your personal details and sign-in password.':'Измените личные данные и пароль для входа.', 'Save profile':'Сохранить профиль', 'Profile saved.':'Профиль сохранён.', 'Change password':'Изменить пароль',
    'Current password':'Текущий пароль', 'New password':'Новый пароль', 'Confirm new password':'Повторите новый пароль', 'Update password':'Обновить пароль', 'Password changed.':'Пароль изменён.', 'Your username cannot be changed.':'Имя пользователя нельзя изменить.', 'Email is already registered':'Эта почта уже зарегистрирована', 'Current password is incorrect':'Текущий пароль неверен',
    'I have a reset code':'У меня есть код восстановления', 'Reset password':'Сбросить пароль', 'Use a reset code from your city administrator.':'Введите код, который выдал администратор.', 'Reset code':'Код восстановления', 'Set new password':'Установить новый пароль', 'Password reset. Sign in with your new password.':'Пароль изменён. Войдите с новым паролем.', 'Passwords do not match.':'Пароли не совпадают.', 'Password reset code':'Код сброса пароля', 'Issue reset code':'Создать код сброса', 'Reset code for':'Код сброса для', 'Copy code':'Скопировать код', 'Code copied. Share it with the account owner.':'Код скопирован. Передайте его владельцу аккаунта.', 'Code expires in 30 minutes.':'Срок действия кода — 30 минут.', 'Choose a password you have not used before':'Выберите пароль, который раньше не использовали.', 'Too many sign-in attempts. Try again in 15 minutes.':'Слишком много попыток входа. Повторите через 15 минут.',
    'Personal details':'Личные данные', 'Manage the name and email used on your account.':'Управляйте именем и почтой аккаунта.', 'Account role':'Роль аккаунта', 'Choose a strong password you have not used before.':'Придумайте надёжный пароль, который раньше не использовали.', 'Your password is stored as a one-way secure hash.':'Пароль хранится в виде защищённого хеша.', 'Account access':'Доступ к аккаунту', 'A fresh start, securely.':'Безопасное восстановление доступа.', 'Account recovery':'Восстановление аккаунта', 'A single-use code expires after 30 minutes.':'Одноразовый код действует 30 минут.', 'Share this one-time code with the account owner through a trusted channel.':'Передайте этот одноразовый код владельцу аккаунта по надёжному каналу.',
    'Account':'Аккаунт', 'Status history':'История статусов', 'Edit report':'Изменить обращение', 'Report updated.':'Обращение изменено.', 'Cancel':'Отмена', 'Search reports…':'Поиск обращений…', 'All categories':'Все категории', 'Optional update note':'Комментарий к обновлению (необязательно)', 'Loading report history…':'Загружаем историю обращения…', 'Departments':'Подразделения', 'Department name':'Название подразделения', 'Department description':'Описание подразделения', 'Add department':'Добавить подразделение', 'No departments yet.':'Подразделений пока нет.', 'Department created.':'Подразделение создано.', 'Department':'Подразделение', 'No department':'Без подразделения', 'Save department':'Сохранить подразделение', 'Department assignment saved.':'Подразделение назначено.', 'Assigned employee':'Ответственный сотрудник', 'Unassigned':'Не назначен', 'Save assignment':'Сохранить назначение', 'Assignment saved.':'Назначение сохранено.', 'Internal notes':'Внутренние заметки', 'No internal notes yet.':'Внутренних заметок пока нет.', 'Write an internal note…':'Напишите внутреннюю заметку…', 'Add note':'Добавить заметку', 'My assigned reports':'Назначенные мне обращения', 'City map':'Карта города', 'Community activity map':'Активность жителей на карте', 'Reported issues and local hotspots appear here when a location has coordinates.':'Заявки и проблемные зоны появятся на карте, если для них указаны координаты.', 'Report hotspot':'Проблемная зона', 'Map data © OpenStreetMap contributors':'Картографические данные © OpenStreetMap contributors', 'Interactive map is unavailable right now.':'Интерактивная карта сейчас недоступна.', 'reports have coordinates. You can still find them in the report list.':'обращений имеют координаты. Их можно найти в списке.', 'Latitude':'Широта', 'Longitude':'Долгота', 'Use my location':'Определить моё место', 'Coordinates are optional and help show this report on the map.':'Координаты необязательны, но помогают показать заявку на карте.', 'Location access is unavailable in this browser.':'Браузер не поддерживает определение места.', 'Could not access your location. Enter coordinates manually.':'Не удалось определить место. Введите координаты вручную.', 'Updates':'Обновления', 'Mark all read':'Отметить всё прочитанным', 'unread':'непрочитанных', 'You are all caught up.':'Новых обновлений нет.', 'Report status updated':'Статус обращения изменён', 'A report has been assigned to you':'Вам назначено обращение', 'City overview':'Сводка по городу', 'Service analytics':'Аналитика служб', 'Live totals across all submitted reports.':'Общие данные по всем обращениям.', 'Download CSV':'Скачать CSV', 'Active':'В работе', 'Over 7 days':'Старше 7 дней', 'Average resolution':'Среднее время решения', 'Reports by month':'Обращения по месяцам', 'By status':'По статусам', 'Top categories':'Популярные категории', 'By department':'По подразделениям', 'No reports yet.':'Обращений пока нет.', 'No assignments yet.':'Назначений пока нет.', 'Could not download the report export.':'Не удалось скачать выгрузку обращений.', 'Please review this report':'Проверьте обращение', 'Status':'Статус'
  }},
  kk: { name: 'Қазақша', map: {
    'Your city, a little better every day':'Қалаңыз күн сайын жақсара түседі', 'Sign in':'Кіру', 'Create account':'Аккаунт ашу', 'My workspace':'Менің кабинетім', 'Sign out':'Шығу',
    'Small reports.':'Шағын өтініштер.', 'Real change.':'Нақты өзгерістер.', 'A clearer way to let your city know what needs attention. Share a local issue, follow its progress, and help your neighborhood move forward.':'Қаладағы мәселені хабарлап, шешілу барысын бақылаңыз және ауданыңыздың дамуына үлес қосыңыз.',
    'Report an issue':'Мәселе туралы хабарлау', 'Already a member?':'Аккаунтыңыз бар ма?', 'A better city starts nearby':'Жақсы өзгеріс жақыннан басталады', 'Every clear report helps teams take action.':'Нақты өтініш қалалық қызметтерге әрекет етуге көмектеседі.',
    'Simple by design':'Қарапайым әрі түсінікті', 'From “someone should”':'«Біреу істеуі керек» дегеннен', 'to “it’s taken care of.”':'«Мәселе шешілді» дегенге дейін.',
    'Everything your report needs, gathered in one clear place.':'Өтінішке қажет нәрсенің бәрі бір жерде.', 'Point it out':'Мәселені көрсетіңіз', 'Describe the issue and tell us where to find it.':'Мәселені сипаттап, орналасқан жерін көрсетіңіз.',
    'Follow along':'Барысын бақылаңыз', 'See your report move through each status.':'Өтініш мәртебесінің өзгеруін көріңіз.', 'See the progress':'Нәтижесін көріңіз', 'City teams update the report as work gets done.':'Қалалық қызметтер жұмыс барысын өтініште жаңартады.',
    'Your neighborhood is worth it':'Ауданыңыз қамқорлыққа лайық', "Let's make the next little thing better.":'Келесі мәселені бірге шешейік.', 'Get started':'Бастау', 'Made for a city that keeps getting better.':'Күн сайын көркейіп келе жатқан қала үшін.', 'Member sign in ↗':'Аккаунтқа кіру ↗',
    '← Back to CityConnect':'← CityConnect басты беті', 'A little care goes a long way.':'Аз да болса қамқорлық көп өзгеріс әкеледі.', 'Report local issues and keep track as they get resolved.':'Мәселе туралы хабарлап, шешілу барысын бақылаңыз.', 'Better neighborhoods, together.':'Аудандарды бірге жақсартамыз.',
    'Welcome to your community':'Қауымдастыққа қош келдіңіз', 'Good things start with a hello.':'Жақсы өзгерістер танысудан басталады.', 'Good to have you back.':'Қайта оралғаныңызға қуаныштымыз.',
    'Create an account to share a concern and follow it all the way through.':'Мәселе туралы хабарлап, шешілуін бақылау үшін аккаунт ашыңыз.', 'Your reports and city updates are right where you left them.':'Өтініштеріңіз бен қала жаңалықтары осында.',
    'CityConnect account':'CityConnect аккаунты', 'Create your account':'Аккаунт ашу', 'Welcome back':'Қош келдіңіз', 'Join your neighbors and help improve your city.':'Көршілеріңізге қосылып, қалаңызды жақсартуға үлес қосыңыз.', 'Sign in to follow your reports and city updates.':'Өтініштер мен қала жаңалықтарын бақылау үшін кіріңіз.',
    'Email address':'Электрондық пошта', 'Username':'Пайдаланушы аты', 'Password':'Құпиясөз', 'Use at least 10 characters.':'Кемінде 10 таңба қолданыңыз.', 'At least 10 characters':'Кемінде 10 таңба', 'Your password':'Құпиясөзіңіз', 'Already have an account?':'Аккаунтыңыз бар ма?', 'New to CityConnect?':'CityConnect-ке алғаш рет кірдіңіз бе?', 'A thoughtful way to help your city move forward.':'Қала дамуына үлес қосудың ыңғайлы жолы.',
    'City administration':'Қала әкімшілігі', 'City team workspace':'Қалалық қызмет кабинеті', 'Your neighborhood workspace':'Ауданыңыздың кабинеті', 'Here’s what’s happening across the community today.':'Бүгін қалада болып жатқан жағдай.', 'Here’s a little snapshot of the change you’re helping create.':'Сіздің үлесіңізбен болған өзгерістердің көрінісі.',
    'Manage roles':'Рөлдерді басқару', 'New report':'Жаңа өтініш', 'All reports':'Барлық өтініш', 'Across the community':'Қала бойынша', 'Submitted by you':'Сіз жіберген', 'Needs attention':'Назар аудару қажет', 'Still moving through the process':'Қаралуда', 'In progress':'Орындалуда', 'Being worked on right now':'Қазір қарастырылып жатыр', 'Resolved':'Шешілді', 'Closed with a positive outcome':'Оң нәтижемен жабылды', 'Community pulse':'Қала тынысы', 'Your activity':'Белсенділігіңіз', 'Latest reports':'Соңғы өтініштер', 'Your reports':'Менің өтініштерім', 'All statuses':'Барлық мәртебе',
    'A little perspective':'Қысқаша мәлімет', 'of your reports have been resolved':'өтінішіңіз шешілді', 'can start a real change':'нақты өзгеріске бастайды', 'resolved':'шешілді', 'still active':'әлі қаралуда', 'Report categories':'Өтініш санаттары', 'Your first report will bring this snapshot to life.':'Алғашқы өтінішіңіз осы мәліметтерді толықтырады.', 'A helpful detail':'Пайдалы кеңес', 'A clear status update helps residents understand what happens next.':'Мәртебені жаңарту тұрғындарға келесі қадамды түсінуге көмектеседі.', 'Add a nearby landmark to help the city team find the issue faster.':'Қызмет мәселені тез табуы үшін жақын маңдағы нысанды көрсетіңіз.',
    'Showing':'Көрсетілгені', 'of':'ішінен', 'reports':'өтініш', 'A good place to begin':'Бастауға жақсы мүмкіндік', 'Your first report can make a difference.':'Алғашқы өтінішіңіз өзгеріс әкелуі мүмкін.', 'Street light out? Sidewalk needs care? Let your city know and keep an eye on the progress.':'Көше шамы жанбай ма? Жолды жөндеу керек пе? Қалаға хабарлап, барысын бақылаңыз.', 'Create your first report':'Алғашқы өтінішті жіберу', 'Update progress':'Мәртебені өзгерту', 'Save update':'Сақтау',
    'A clear report goes a long way':'Нақты өтініш мәселені шешуге көмектеседі', 'Tell us what':'Мәселені', 'needs attention.':'сипаттаңыз.', 'Share a few details so the right city team can understand the issue and take a closer look.':'Қалалық қызмет мәселені түсініп, тексеруі үшін мәлімет қосыңыз.', 'Your report is saved securely to your account.':'Өтініш аккаунтыңызда қауіпсіз сақталады.', 'Describe the issue':'Мәселені сипаттаңыз', 'Start with the detail that matters most.':'Ең маңыздысынан бастаңыз.', 'Issue title':'Қысқаша атауы', 'A little more detail':'Толығырақ', 'What happened? When did you notice it? Any detail that could help the city team?':'Не болды? Қашан байқадыңыз? Қызметке көмектесетін қандай мәлімет бар?', 'A few clear sentences are usually enough.':'Бірнеше нақты сөйлем жеткілікті.', 'Help us locate it':'Орнын көрсетіңіз', 'Choose a category and add a nearby location.':'Санатты таңдап, мекенжайды жазыңыз.', 'Category':'Санат', 'Choose category':'Санатты таңдаңыз', 'Location':'Орналасқан жері', 'Street, area or landmark':'Көше, аудан немесе бағдар', 'Include a street name, building, or landmark so the team can find the spot.':'Қызмет орынды табуы үшін көше, ғимарат немесе бағдарды жазыңыз.', 'Submit report':'Өтініш жіберу', 'By submitting, you confirm these details are accurate to the best of your knowledge.':'Өтінішті жіберу арқылы мәліметтердің дұрыстығын растайсыз.',
    'People make the city.':'Қаланы адамдар жасайды.', 'Manage team access and community roles from one place.':'Қызметкерлердің қолжетімділігі мен рөлдерін бір жерден басқарыңыз.', 'Save role':'Рөлді сақтау', 'Gathering your city updates…':'Қала жаңалықтары жүктелуде…', 'We couldn’t load your reports':'Өтініштер жүктелмеді', "We couldn't load your reports":'Өтініштер жүктелмеді', 'Try again':'Қайталау', 'No reports with this status':'Бұл мәртебеде өтініш жоқ', 'Choose another status to see more updates.':'Басқа мәртебені таңдап көріңіз.', 'Report status updated.':'Өтініш мәртебесі жаңартылды.', 'Report submitted. Thank you for speaking up.':'Өтініш жіберілді. Белсенділігіңізге рақмет.', 'Role updated.':'Рөл жаңартылды.',
    'Please check the submitted fields':'Өрістердің дұрыс толтырылғанын тексеріңіз', 'The request body is missing or malformed':'Сұрау деректері бос немесе қате пішімде', 'This change conflicts with existing data. Refresh and try again.':'Бұл дерек бұрыннан бар. Бетті жаңартып, қайталап көріңіз.', 'Please sign in and try again':'Аккаунтқа кіріп, қайталап көріңіз', 'You do not have permission to perform this action':'Бұл әрекетті орындауға рұқсатыңыз жоқ', 'Something went wrong. Please try again.':'Қате пайда болды. Қайталап көріңіз.', 'Username or email is already registered':'Бұл пайдаланушы аты немесе пошта тіркелген', 'Invalid username or password':'Пайдаланушы аты немесе құпиясөз қате', 'Staff role required':'Қызметкер рөлі қажет', 'Unknown status':'Белгісіз мәртебе', 'Unknown role':'Белгісіз рөл',
    'NEW':'ЖАҢА', 'UNDER REVIEW':'ТЕКСЕРІЛУДЕ', 'ACCEPTED':'ҚАБЫЛДАНДЫ', 'IN PROGRESS':'ОРЫНДАЛУДА', 'RESOLVED':'ШЕШІЛДІ', 'REJECTED':'ҚАБЫЛДАНБАДЫ', 'CLOSED':'ЖАБЫЛДЫ', 'CITIZEN':'ТҰРҒЫН', 'EMPLOYEE':'ҚЫЗМЕТКЕР', 'ADMIN':'ӘКІМШІ',
    'Roads and sidewalks':'Жолдар мен тротуарлар', 'Street lighting':'Көше жарығы', 'Waste and cleanliness':'Қоқыс пен тазалық', 'Water and drainage':'Су және кәріз', 'Parks and public spaces':'Саябақтар мен қоғамдық орындар', 'Other':'Басқа',
    'Comment':'Пікір', 'Comments':'Пікірлер', 'Add a comment':'Пікір қосу', 'Write a helpful update…':'Пайдалы пікір жазыңыз…', 'Post comment':'Жариялау', 'Vote':'Қолдау', 'Voted':'Қолдадыңыз', 'Report support':'Қолдау', 'No comments yet. Start the conversation.':'Әзірге пікір жоқ. Алғашқы пікірді жазыңыз.', 'Comment added.':'Пікір қосылды.', 'You can vote only once.':'Бір рет қана қолдау білдіруге болады.',
    'Full name':'Аты-жөні', 'Your name':'Атыңыз', 'Account created. Welcome to CityConnect!':'Аккаунт ашылды. CityConnect-ке қош келдіңіз!', 'Password must contain at least 10 characters.':'Құпиясөз кемінде 10 таңбадан тұруы керек.', 'Please check the form and try again.':'Пішінді тексеріп, қайталап көріңіз.',
    'Good morning':'Қайырлы таң', 'Good afternoon':'Қайырлы күн', 'Good evening':'Қайырлы кеш', 'of community reports have been resolved':'қалалық өтініш шешілді',
    'Report details':'Өтініш мәліметтері', 'Thank this resident':'Тұрғынға қолдау білдіру', 'Loading comments…':'Пікірлер жүктелуде…', 'Could not load comments.':'Пікірлер жүктелмеді.', 'You need an account to participate.':'Қатысу үшін аккаунтқа кіріңіз.',
    'Community reports':'Тұрғындардың өтініштері', 'Show comments':'Пікірлерді көрсету', 'Hide comments':'Пікірлерді жасыру', 'Vote':'Қолдау', 'Voted':'Қолдадыңыз', 'Post comment':'Жариялау', 'Comments':'Пікірлер', 'Comment added.':'Пікір қосылды.', 'The requested item could not be found':'Сұралған жазба табылмады',
    'New report nearby':'Жақын жерде жаңа өтініш', 'Street lighting · just now':'Көше жарығы · жаңа ғана', 'Issue resolved':'Мәселе шешілді', 'One more neighborhood win':'Аудан үшін тағы бір жетістік',
    'One report':'Бір өтініш', 'Sending your report…':'Өтініш жіберілуде…', 'Your username':'Пайдаланушы атыңыз', 'Filter reports by status':'Өтініштерді мәртебе бойынша сүзу', 'Role for':'Пайдаланушы рөлі', 'Details':'Толығырақ', 'Language':'Тіл', 'CityConnect — Your city, a little better every day':'CityConnect — қалаңыз күн сайын жақсарады', 'Sign in →':'Кіру →',
    'Edit profile':'Профиль', 'Your profile':'Профиліңіз', 'Update your personal details and sign-in password.':'Жеке деректеріңіз бен кіру құпиясөзін өзгертіңіз.', 'Save profile':'Профильді сақтау', 'Profile saved.':'Профиль сақталды.', 'Change password':'Құпиясөзді өзгерту',
    'Current password':'Ағымдағы құпиясөз', 'New password':'Жаңа құпиясөз', 'Confirm new password':'Жаңа құпиясөзді қайталаңыз', 'Update password':'Құпиясөзді жаңарту', 'Password changed.':'Құпиясөз өзгертілді.', 'Your username cannot be changed.':'Пайдаланушы атын өзгерту мүмкін емес.', 'Email is already registered':'Бұл пошта тіркелген', 'Current password is incorrect':'Ағымдағы құпиясөз қате',
    'I have a reset code':'Қалпына келтіру кодым бар', 'Reset password':'Құпиясөзді қалпына келтіру', 'Use a reset code from your city administrator.':'Әкімші берген қалпына келтіру кодын енгізіңіз.', 'Reset code':'Қалпына келтіру коды', 'Set new password':'Жаңа құпиясөз орнату', 'Password reset. Sign in with your new password.':'Құпиясөз жаңартылды. Жаңа құпиясөзбен кіріңіз.', 'Passwords do not match.':'Құпиясөздер сәйкес емес.', 'Password reset code':'Құпиясөзді қалпына келтіру коды', 'Issue reset code':'Қалпына келтіру кодын жасау', 'Reset code for':'Қалпына келтіру коды', 'Copy code':'Кодты көшіру', 'Code copied. Share it with the account owner.':'Код көшірілді. Оны аккаунт иесіне жіберіңіз.', 'Code expires in 30 minutes.':'Код 30 минут жарамды.', 'Choose a password you have not used before':'Бұрын қолданбаған құпиясөзді таңдаңыз.', 'Too many sign-in attempts. Try again in 15 minutes.':'Кіру әрекеті тым көп. 15 минуттан кейін қайталаңыз.',
    'Personal details':'Жеке деректер', 'Manage the name and email used on your account.':'Аккаунттағы аты-жөніңіз бен поштаңызды басқарыңыз.', 'Account role':'Аккаунт рөлі', 'Choose a strong password you have not used before.':'Бұрын қолданбаған күрделі құпиясөз таңдаңыз.', 'Your password is stored as a one-way secure hash.':'Құпиясөз қорғалған хеш түрінде сақталады.', 'Account access':'Аккаунтқа қолжетімділік', 'A fresh start, securely.':'Қолжетімділікті қауіпсіз қалпына келтіру.', 'Account recovery':'Аккаунтты қалпына келтіру', 'A single-use code expires after 30 minutes.':'Бір реттік код 30 минуттан кейін жарамсыз болады.', 'Share this one-time code with the account owner through a trusted channel.':'Бұл бір реттік кодты аккаунт иесіне қауіпсіз арнамен жіберіңіз.',
    'Account':'Аккаунт', 'Status history':'Мәртебелер тарихы', 'Edit report':'Өтінішті өзгерту', 'Report updated.':'Өтініш өзгертілді.', 'Cancel':'Болдырмау', 'Search reports…':'Өтініштерді іздеу…', 'All categories':'Барлық санаттар', 'Optional update note':'Жаңарту түсініктемесі (міндетті емес)', 'Loading report history…':'Өтініш тарихы жүктелуде…', 'Departments':'Бөлімдер', 'Department name':'Бөлім атауы', 'Department description':'Бөлім сипаттамасы', 'Add department':'Бөлім қосу', 'No departments yet.':'Әзірге бөлімдер жоқ.', 'Department created.':'Бөлім құрылды.', 'Department':'Бөлім', 'No department':'Бөлім жоқ', 'Save department':'Бөлімді сақтау', 'Department assignment saved.':'Бөлім тағайындалды.', 'Assigned employee':'Жауапты қызметкер', 'Unassigned':'Тағайындалмаған', 'Save assignment':'Тағайындауды сақтау', 'Assignment saved.':'Тағайындау сақталды.', 'Internal notes':'Ішкі жазбалар', 'No internal notes yet.':'Әзірге ішкі жазба жоқ.', 'Write an internal note…':'Ішкі жазба жазыңыз…', 'Add note':'Жазба қосу', 'My assigned reports':'Маған тағайындалған өтініштер', 'City map':'Қала картасы', 'Community activity map':'Қаладағы белсенділік картасы', 'Reported issues and local hotspots appear here when a location has coordinates.':'Координаттары бар өтініштер мен проблемалық орындар осы картада көрсетіледі.', 'Report hotspot':'Мәселе ошағы', 'Map data © OpenStreetMap contributors':'Карта деректері © OpenStreetMap contributors', 'Interactive map is unavailable right now.':'Интерактивті карта қазір қолжетімсіз.', 'reports have coordinates. You can still find them in the report list.':'өтініштің координаттары бар. Оларды тізімнен көруге болады.', 'Latitude':'Ендік', 'Longitude':'Бойлық', 'Use my location':'Орналасқан жерімді анықтау', 'Coordinates are optional and help show this report on the map.':'Координаттар міндетті емес, бірақ өтінішті картадан көрсетуге көмектеседі.', 'Location access is unavailable in this browser.':'Бұл браузер орналасқан жерді анықтай алмайды.', 'Could not access your location. Enter coordinates manually.':'Орналасқан жер анықталмады. Координаттарды қолмен енгізіңіз.', 'Updates':'Жаңартулар', 'Mark all read':'Барлығын оқылды деп белгілеу', 'unread':'оқылмаған', 'You are all caught up.':'Жаңа жаңартулар жоқ.', 'Report status updated':'Өтініш мәртебесі өзгерді', 'A report has been assigned to you':'Сізге өтініш тағайындалды', 'City overview':'Қала бойынша шолу', 'Service analytics':'Қызметтер аналитикасы', 'Live totals across all submitted reports.':'Барлық түскен өтініштердің жалпы деректері.', 'Download CSV':'CSV жүктеу', 'Active':'Орындалуда', 'Over 7 days':'7 күннен асқан', 'Average resolution':'Орташа шешу уақыты', 'Reports by month':'Айлар бойынша өтініштер', 'By status':'Мәртебе бойынша', 'Top categories':'Танымал санаттар', 'By department':'Бөлім бойынша', 'No reports yet.':'Әзірге өтініш жоқ.', 'No assignments yet.':'Әзірге тағайындау жоқ.', 'Could not download the report export.':'Өтініштерді жүктеу мүмкін болмады.', 'Please review this report':'Өтінішті тексеріңіз', 'Status':'Мәртебе'
  }}
};
const state = { token: sessionStorage.getItem('cc-token'), user: null, incidents: [], assignedIncidents: [], showAssigned: false, departments: [], employees: [], analytics: null, notificationInbox: {items:[],unreadCount:0}, lang: localStorage.getItem('cc-language') || 'en' };
const app = document.querySelector('#app');
const accountNav = document.querySelector('#account-nav');

function t(text) { return LANGUAGES[state.lang]?.map?.[text] || text; }
function setLanguage(language) {
  if (!LANGUAGES[language]) return;
  state.lang = language;
  localStorage.setItem('cc-language', language);
  render();
}
function applyTranslations(root = app) {
  document.documentElement.lang = state.lang;
  document.title = t('CityConnect — Your city, a little better every day');
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const match = node.nodeValue.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!match || !match[2]) continue;
    const translated = t(match[2]);
    if (translated !== match[2]) node.nodeValue = match[1] + translated + match[3];
  }
  root.querySelectorAll('[placeholder], [aria-label], [title]').forEach(element => {
    for (const attribute of ['placeholder', 'aria-label', 'title']) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, t(element.getAttribute(attribute)));
    }
  });
}
function localizedStatus(status) { return t(status.replaceAll('_', ' ')); }
function localizedRole(role) { return t(role); }

function escapeHtml(value = '') {
  return String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));
}

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;
  const response = await fetch(API + path, { ...options, headers });
  const type = response.headers.get('content-type') || '';
  const body = type.includes('json') ? await response.json() : null;
  if (!response.ok) {
    const fallback = response.status === 401 ? 'Please sign in and try again'
      : response.status === 403 ? 'You do not have permission to perform this action'
      : response.status === 404 ? 'The requested item could not be found'
      : response.status >= 500 ? 'Something went wrong. Please try again.'
      : `Request failed (${response.status})`;
    throw new Error(t(body?.message || body?.detail || fallback));
  }
  return body;
}

function setSession(data) {
  state.token = data.token;
  state.user = data.user;
  sessionStorage.setItem('cc-token', data.token);
  render();
}

function logout() {
  state.token = null;
  state.user = null;
  state.incidents = [];
  sessionStorage.removeItem('cc-token');
  location.hash = '';
  render();
}

function showMessage(node, message) {
  let element = node.querySelector('.message');
  if (!element) {
    element = document.createElement('div');
    element.className = 'message';
    node.append(element);
  }
  element.textContent = message;
}

function updateNav() {
  accountNav.innerHTML = state.user
    ? `<div class="nav-actions"><a class="nav-link" href="#dashboard">My workspace</a><a class="nav-link" href="#profile">${t('Edit profile')}</a><span class="user-pill"><span class="avatar">${escapeHtml((state.user.fullName || state.user.username).slice(0, 1).toUpperCase())}</span><span class="user-label">${escapeHtml(state.user.fullName || state.user.username)}<small>${localizedRole(state.user.role)}</small></span></span><button class="button-quiet" id="logout">Sign out</button>${languagePicker()}</div>`
    : `<div class="nav-actions"><a class="nav-link" href="#login">Sign in</a><a class="button button-small" href="#register">Create account <span aria-hidden="true">↗</span></a>${languagePicker()}</div>`;
  document.querySelector('#logout')?.addEventListener('click', logout);
  document.querySelector('#language-switch').addEventListener('change', event => setLanguage(event.target.value));
  applyTranslations(accountNav);
}

function languagePicker() {
  return `<label class="language-picker" title="Language"><span aria-hidden="true">文</span><select id="language-switch" aria-label="Language"><option value="en" ${state.lang === 'en' ? 'selected' : ''}>EN</option><option value="ru" ${state.lang === 'ru' ? 'selected' : ''}>RU</option><option value="kk" ${state.lang === 'kk' ? 'selected' : ''}>KZ</option></select><span class="language-caret">⌄</span></label>`;
}

function render() {
  updateNav();
  if (!state.user) {
    if (location.hash === '#login') return authPage('login');
    if (location.hash === '#register') return authPage('register');
    if (location.hash === '#reset') return passwordResetPage();
    return landing();
  }
  if (location.hash === '#profile') return profilePage();
  if (location.hash === '#users') return manageUsers();
  dashboard();
}

function landing() {
  app.innerHTML = `
    <section class="hero-grid">
      <div class="hero-copy reveal">
        <div class="eyebrow"><span class="eyebrow-dot"></span> Your city, a little better every day</div>
        <h1>Small reports.<br><span>Real change.</span></h1>
        <p class="hero-lede">A clearer way to let your city know what needs attention. Share a local issue, follow its progress, and help your neighborhood move forward.</p>
        <div class="hero-actions"><a class="button" href="#register">Report an issue <span aria-hidden="true">↗</span></a><a class="text-action" href="#login">Already a member? <span>Sign in →</span></a></div>
        <div class="hero-proof"><div class="proof-avatars"><span>AK</span><span>DM</span><span>+2</span></div><div><strong>A better city starts nearby</strong><small>Every clear report helps teams take action.</small></div></div>
      </div>
      <div class="hero-art reveal" aria-label="Illustration of a city report being tracked">
        <div class="art-orbit orbit-one"></div><div class="art-orbit orbit-two"></div>
        <div class="sun-disc"></div><div class="city-scene"><span class="building building-one"></span><span class="building building-two"></span><span class="building building-three"></span><span class="building building-four"></span><span class="city-ground"></span><span class="tree tree-one"></span><span class="tree tree-two"></span><span class="lamp-post"><i></i></span></div>
        <div class="floating-card report-float"><span class="float-icon icon-purple">⌖</span><span><strong>New report nearby</strong><small>Street lighting · just now</small></span><span class="live-pulse"></span></div>
        <div class="floating-card resolved-float"><span class="check-badge">✓</span><span><strong>Issue resolved</strong><small>One more neighborhood win</small></span></div>
        <div class="art-caption"><span class="caption-mark">C</span><span><strong>CityConnect</strong><small>People and city teams, together</small></span></div>
      </div>
    </section>

    <section class="how-section reveal">
      <div class="section-intro"><div class="eyebrow">Simple by design</div><h2>From “someone should”<br>to “it’s taken care of.”</h2><p>Everything your report needs, gathered in one clear place.</p></div>
      <div class="steps-grid">
        <article class="step-card"><span class="step-number">01</span><span class="step-icon">⌖</span><h3>Point it out</h3><p>Describe the issue and tell us where to find it.</p><span class="step-line"></span></article>
        <article class="step-card"><span class="step-number">02</span><span class="step-icon">↗</span><h3>Follow along</h3><p>See your report move through each status.</p><span class="step-line"></span></article>
        <article class="step-card"><span class="step-number">03</span><span class="step-icon">✳</span><h3>See the progress</h3><p>City teams update the report as work gets done.</p><span class="step-line"></span></article>
      </div>
    </section>
    <section class="bottom-cta reveal"><div><span class="eyebrow eyebrow-light">Your neighborhood is worth it</span><h2>Let's make the next little thing better.</h2></div><a class="button button-light" href="#register">Get started <span>↗</span></a><span class="cta-star star-a">✳</span><span class="cta-star star-b">✦</span></section>
    <footer class="site-footer"><a class="brand" href="/"><span class="brand-mark">C</span> CityConnect</a><span>Made for a city that keeps getting better.</span><a href="#login">Member sign in ↗</a></footer>`;
  applyTranslations();
  observeReveals();
}

function authPage(mode) {
  const register = mode === 'register';
  app.innerHTML = `
    <section class="auth-layout">
      <div class="auth-aside">
        <a class="back-home" href="/">← Back to CityConnect</a>
        <div class="auth-art"><span class="auth-spark spark-one">✳</span><span class="auth-spark spark-two">✦</span><div class="auth-art-ring ring-one"></div><div class="auth-art-ring ring-two"></div><div class="auth-art-card"><span class="auth-art-icon">⌖</span><div><strong>A little care goes a long way.</strong><small>Report local issues and keep track as they get resolved.</small></div><span class="auth-art-tick">✓</span></div><div class="auth-art-footer"><span class="auth-avatar-stack"><i>AK</i><i>DM</i><i>+2</i></span><span>Better neighborhoods, together.</span></div></div>
        <div class="auth-aside-copy"><span class="eyebrow eyebrow-light">Welcome to your community</span><h2>${register ? 'Good things start with a hello.' : 'Good to have you back.'}</h2><p>${register ? 'Create an account to share a concern and follow it all the way through.' : 'Your reports and city updates are right where you left them.'}</p></div>
      </div>
      <div class="auth-main"><form class="auth-card reveal"><div class="eyebrow">CityConnect account</div><h1>${register ? 'Create your account' : 'Welcome back'}</h1><p class="subtle">${register ? 'Join your neighbors and help improve your city.' : 'Sign in to follow your reports and city updates.'}</p>
        ${register ? '<div class="field"><label for="fullName">Full name</label><input id="fullName" name="fullName" autocomplete="name" minlength="2" maxlength="80" placeholder="Your name" required></div><div class="field"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" maxlength="254" placeholder="you@example.com" required></div>' : ''}
        <div class="field"><label for="username">Username</label><input id="username" name="username" autocomplete="username" minlength="3" maxlength="40" placeholder="Your username" required></div>
        <div class="field"><label for="password">Password</label><input id="password" name="password" type="password" autocomplete="${register ? 'new-password' : 'current-password'}" minlength="${register ? '10' : '1'}" placeholder="${register ? 'At least 10 characters' : 'Your password'}" required>${register ? '<small class="field-hint">Use at least 10 characters.</small>' : ''}</div>
        <button class="button button-full">${register ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span></button>
        <p class="switch">${register ? 'Already have an account?' : 'New to CityConnect?'} <a href="#${register ? 'login' : 'register'}">${register ? 'Sign in' : 'Create an account'}</a></p>
        ${register ? '' : '<p class="switch"><a href="#reset">I have a reset code</a></p>'}
      </form><div class="auth-footnote"><span>✳</span> A thoughtful way to help your city move forward.</div></div>
    </section>`;
  const form = app.querySelector('form');
  form.onsubmit = async event => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      const payload = { username: form.username.value.trim(), password: form.password.value };
      if (register) Object.assign(payload, { fullName: form.fullName.value.trim(), email: form.email.value.trim() });
      setSession(await api(`/auth/${register ? 'register' : 'login'}`, { method: 'POST', body: JSON.stringify(payload) }));
    } catch (error) {
      showMessage(form, error.message);
    } finally {
      button.disabled = false;
    }
  };
  applyTranslations();
  observeReveals();
}

function profilePage() {
  const user = state.user;
  app.innerHTML = `<section class="profile-page"><button class="back-home" id="profile-back">← ${t('My workspace')}</button><div class="profile-heading"><span class="eyebrow">${t('Account')}</span><h1>${t('Your profile')}</h1><p>${t('Update your personal details and sign-in password.')}</p></div><div class="profile-grid"><form class="profile-card" id="profile-form"><div class="profile-card-head"><span class="profile-icon">✦</span><div><h2>${t('Personal details')}</h2><p>${t('Manage the name and email used on your account.')}</p></div></div><div class="field"><label for="profile-full-name">${t('Full name')}</label><input id="profile-full-name" name="fullName" value="${escapeHtml(user.fullName || '')}" minlength="2" maxlength="80" required></div><div class="field"><label for="profile-email">${t('Email address')}</label><input id="profile-email" name="email" type="email" value="${escapeHtml(user.email)}" maxlength="254" required></div><div class="field"><label for="profile-username">${t('Username')}</label><input id="profile-username" value="${escapeHtml(user.username)}" disabled><small class="field-hint">${t('Your username cannot be changed.')}</small></div><div class="profile-account-meta"><span>${t('Account role')}</span><strong>${localizedRole(user.role)}</strong></div><button class="button button-full">${t('Save profile')}</button></form><form class="profile-card" id="password-form"><div class="profile-card-head"><span class="profile-icon profile-icon-lock">⌑</span><div><h2>${t('Change password')}</h2><p>${t('Choose a strong password you have not used before.')}</p></div></div><div class="field"><label for="current-password">${t('Current password')}</label><input id="current-password" name="currentPassword" type="password" autocomplete="current-password" required></div><div class="field"><label for="new-password">${t('New password')}</label><input id="new-password" name="newPassword" type="password" minlength="10" maxlength="72" autocomplete="new-password" required></div><div class="field"><label for="confirm-password">${t('Confirm new password')}</label><input id="confirm-password" name="confirmPassword" type="password" minlength="10" maxlength="72" autocomplete="new-password" required></div><button class="button button-full">${t('Update password')}</button><div class="profile-security-note"><span>✓</span>${t('Your password is stored as a one-way secure hash.')}</div></form></div></section>`;
  applyTranslations();
  document.querySelector('#profile-back').onclick = () => { location.hash = 'dashboard'; };
  const profileForm = document.querySelector('#profile-form');
  profileForm.onsubmit = async event => {
    event.preventDefault();
    const button = profileForm.querySelector('button');
    button.disabled = true;
    try {
      state.user = await api('/auth/profile', { method: 'PATCH', body: JSON.stringify({ fullName: profileForm.fullName.value.trim(), email: profileForm.email.value.trim() }) });
      toast(t('Profile saved.'));
      updateNav();
      profilePage();
    } catch (error) { showMessage(profileForm, error.message); }
    finally { button.disabled = false; }
  };
  const passwordForm = document.querySelector('#password-form');
  passwordForm.onsubmit = async event => {
    event.preventDefault();
    if (passwordForm.newPassword.value !== passwordForm.confirmPassword.value) return showMessage(passwordForm, t('Passwords do not match.'));
    const button = passwordForm.querySelector('button');
    button.disabled = true;
    try {
      await api('/auth/password', { method: 'PATCH', body: JSON.stringify({ currentPassword: passwordForm.currentPassword.value, newPassword: passwordForm.newPassword.value }) });
      toast(t('Password changed.'));
      passwordForm.reset();
    } catch (error) { showMessage(passwordForm, error.message); }
    finally { button.disabled = false; }
  };
  observeReveals();
}

function passwordResetPage() {
  app.innerHTML = `<section class="auth-layout reset-layout"><div class="auth-aside"><a class="back-home" href="#login">← ${t('Sign in')}</a><div class="auth-art"><span class="auth-spark spark-one">✳</span><span class="auth-art-ring ring-one"></span><div class="auth-art-card"><span class="auth-art-icon">⌑</span><div><strong>${t('Password reset code')}</strong><small>${t('A single-use code expires after 30 minutes.')}</small></div></div></div><div class="auth-aside-copy"><span class="eyebrow eyebrow-light">${t('Account access')}</span><h2>${t('A fresh start, securely.')}</h2><p>${t('Use a reset code from your city administrator.')}</p></div></div><div class="auth-main"><form class="auth-card" id="reset-form"><div class="eyebrow">${t('Account recovery')}</div><h1>${t('Reset password')}</h1><p class="subtle">${t('Use a reset code from your city administrator.')}</p><div class="field"><label for="reset-token">${t('Reset code')}</label><input id="reset-token" name="token" autocomplete="one-time-code" minlength="40" maxlength="64" required></div><div class="field"><label for="reset-new-password">${t('New password')}</label><input id="reset-new-password" name="newPassword" type="password" minlength="10" maxlength="72" autocomplete="new-password" required></div><div class="field"><label for="reset-confirm-password">${t('Confirm new password')}</label><input id="reset-confirm-password" name="confirmPassword" type="password" minlength="10" maxlength="72" autocomplete="new-password" required></div><button class="button button-full">${t('Set new password')} <span>→</span></button><p class="switch"><a href="#login">${t('Sign in')}</a></p></form></div></section>`;
  applyTranslations();
  const form = document.querySelector('#reset-form');
  form.onsubmit = async event => {
    event.preventDefault();
    if (form.newPassword.value !== form.confirmPassword.value) return showMessage(form, t('Passwords do not match.'));
    const button = form.querySelector('button');
    button.disabled = true;
    try {
      await api('/auth/password-reset', { method: 'POST', body: JSON.stringify({ token: form.token.value.trim(), newPassword: form.newPassword.value }) });
      location.hash = 'login';
      setTimeout(() => toast(t('Password reset. Sign in with your new password.')), 0);
    } catch (error) { showMessage(form, error.message); }
    finally { button.disabled = false; }
  };
  observeReveals();
}

function summarize(incidents) {
  const count = status => incidents.filter(item => item.status === status).length;
  const unresolved = incidents.filter(item => !['RESOLVED', 'CLOSED', 'REJECTED'].includes(item.status)).length;
  const resolved = count('RESOLVED') + count('CLOSED');
  const categories = CATEGORIES.map(category => ({ category, count: incidents.filter(item => item.category === category).length }))
    .filter(item => item.count).sort((a, b) => b.count - a.count);
  return { total: incidents.length, unresolved, resolved, inProgress: count('IN_PROGRESS'), categories };
}

async function dashboard() {
  app.innerHTML = `<div class="loading-shell"><span class="loading-orb"></span><span>${t('Gathering your city updates…')}</span></div>`;
  try {
    state.incidents = await api('/incidents');
    state.notificationInbox=await api('/notifications');
    if(state.user.role==='EMPLOYEE') state.assignedIncidents=await api('/incidents/assigned');
    if(state.user.role==='ADMIN'){
      [state.departments,state.employees,state.analytics]=await Promise.all([api('/admin/departments'),api('/admin/users').then(users=>users.filter(user=>user.role==='EMPLOYEE')),api('/admin/analytics')]);
    }
    renderDashboard();
  } catch (error) {
    if (error.message.includes('401')) return logout();
    app.innerHTML = `<div class="empty"><strong>${t("We couldn't load your reports")}</strong><p>${escapeHtml(error.message)}</p><button class="button" id="retry">${t('Try again')}</button></div>`;
    applyTranslations();
    document.querySelector('#retry').onclick = dashboard;
  }
}

function initCityMap(){
  const container=document.querySelector('#city-map'); if(!container)return;
  const mapped=state.incidents.filter(item=>Number.isFinite(item.latitude)&&Number.isFinite(item.longitude));
  if(!window.L){container.innerHTML=`<div class="map-fallback"><span>⌖</span><strong>${t('Interactive map is unavailable right now.')}</strong><p>${mapped.length} ${t('reports have coordinates. You can still find them in the report list.')}</p></div>`;return;}
  const center=mapped.length?[mapped.reduce((s,i)=>s+i.latitude,0)/mapped.length,mapped.reduce((s,i)=>s+i.longitude,0)/mapped.length]:[43.65,51.16];
  const map=L.map(container,{scrollWheelZoom:false}).setView(center,mapped.length?12:11);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap contributors'}).addTo(map);
  for(const item of mapped){
    const color=['RESOLVED','CLOSED'].includes(item.status)?'#55a789':item.status==='NEW'?'#9963db':'#e3a345';
    L.circle([item.latitude,item.longitude],{radius:240+Math.min(item.voteCount,10)*35,color,weight:1,fillColor:color,fillOpacity:.15}).addTo(map);
    L.circleMarker([item.latitude,item.longitude],{radius:6,color:'#fff',weight:2,fillColor:color,fillOpacity:1}).bindPopup(`<strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.location)}<br>${localizedStatus(item.status)}`).addTo(map);
  }
  if(mapped.length>1)map.fitBounds(mapped.map(item=>[item.latitude,item.longitude]),{padding:[25,25],maxZoom:14});
  setTimeout(()=>map.invalidateSize(),50);
}

function renderDashboard(filtered) {
  const user = state.user;
  const baseItems=user.role==='EMPLOYEE'&&state.showAssigned?state.assignedIncidents:state.incidents;
  if(!filtered) filtered=baseItems;
  const stats = summarize(state.incidents);
  const isStaff = user.role !== 'CITIZEN';
  const firstName = (user.fullName || user.username).split(/[ ._-]/)[0];
  app.innerHTML = `
    <section class="workspace-top reveal"><div><div class="eyebrow"><span class="eyebrow-dot"></span>${user.role === 'ADMIN' ? 'City administration' : user.role === 'EMPLOYEE' ? 'City team workspace' : 'Your neighborhood workspace'}</div><h1 class="welcome-title">${greeting()}, ${escapeHtml(firstName)}<span class="wave">✳</span></h1><p>${isStaff ? 'Here’s what’s happening across the community today.' : 'Here’s a little snapshot of the change you’re helping create.'}</p></div><div class="workspace-actions">${user.role === 'ADMIN' ? '<button class="button button-soft" id="manage-users">Manage roles</button>' : ''}<button class="button" id="new-report"><span class="plus-mark">＋</span> New report</button></div></section>
    <section class="stats-grid reveal">
      <article class="stat-card stat-primary"><div class="stat-top"><span>All reports</span><span class="stat-icon">▤</span></div><strong>${stats.total}</strong><small>Across the community</small><span class="stat-decoration decoration-one"></span></article>
      <article class="stat-card"><div class="stat-top"><span>Needs attention</span><span class="stat-icon icon-amber">◷</span></div><strong>${stats.unresolved}</strong><small>Still moving through the process</small><div class="stat-sparkline"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div></article>
      <article class="stat-card"><div class="stat-top"><span>In progress</span><span class="stat-icon icon-blue">↗</span></div><strong>${stats.inProgress}</strong><small>Being worked on right now</small><div class="stat-progress"><i style="width:${stats.total ? Math.round(stats.inProgress / stats.total * 100) : 0}%"></i></div></article>
      <article class="stat-card"><div class="stat-top"><span>Resolved</span><span class="stat-icon icon-green">✓</span></div><strong>${stats.resolved}</strong><small>Closed with a positive outcome</small><span class="stat-decoration decoration-two">✳</span></article>
    </section>
    ${user.role==='ADMIN'&&state.analytics?renderAnalytics(state.analytics):''}
    <section class="map-panel reveal"><div class="map-panel-head"><div><div class="eyebrow">${t('City map')}</div><h2>${t('Community activity map')}</h2><p>${t('Reported issues and local hotspots appear here when a location has coordinates.')}</p></div><span class="map-legend"><i></i>${t('Report hotspot')}</span></div><div id="city-map" aria-label="Community reports map"></div><div class="map-credit">${t('Map data © OpenStreetMap contributors')}</div></section>
    <section class="workspace-grid">
      <div class="workspace-main reveal">
        <div class="assigned-toolbar">${user.role==='EMPLOYEE'?`<button class="button ${state.showAssigned?'':'button-soft'}" id="assigned-toggle">${state.showAssigned?t('Community reports'):t('My assigned reports')} <strong>${state.assignedIncidents.length}</strong></button>`:''}</div>
        <div class="list-heading"><div><div class="eyebrow">${isStaff ? 'Community pulse' : 'Your activity'}</div><h2>${isStaff ? 'Latest reports' : 'Community reports'} <span class="count-chip">${baseItems.length}</span></h2></div><div class="report-filters"><input id="report-search" type="search" placeholder="Search reports…" aria-label="Search reports"><select id="category-filter" aria-label="Filter by category"><option value="ALL">All categories</option>${CATEGORIES.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(t(category))}</option>`).join('')}</select><select id="status-filter" aria-label="Filter reports by status"><option value="ALL">All statuses</option>${STATUSES.map(status => `<option value="${status}">${localizedStatus(status)}</option>`).join('')}</select></div></div>
        <div class="incident-list" id="incident-list">${filtered.length ? filtered.map(card).join('') : emptyReports(baseItems.length > 0)}</div>
        ${baseItems.length ? `<div class="list-footer"><span>${t('Showing')} ${filtered.length} ${t('of')} ${baseItems.length} ${t('reports')}</span><span class="list-footer-mark">✳</span></div>` : ''}
      </div>
      <aside class="workspace-aside reveal">
        <article class="side-panel impact-panel"><div class="side-panel-heading"><span class="eyebrow">A little perspective</span><span class="panel-spark">✳</span></div><h3>${stats.total ? `${Math.round(stats.resolved / stats.total * 100)}%` : t('One report')}<br><span>${stats.total ? 'of community reports have been resolved' : 'can start a real change'}</span></h3><div class="impact-track"><i style="width:${stats.total ? Math.round(stats.resolved / stats.total * 100) : 4}%"></i></div><small>${stats.resolved} ${t('resolved')} <span>·</span> ${stats.unresolved} ${t('still active')}</small></article>
        <article class="side-panel category-panel"><div class="side-panel-heading"><span class="eyebrow">Report categories</span><span class="side-panel-icon">⌖</span></div>${stats.categories.length ? `<div class="category-list">${stats.categories.slice(0, 4).map((item, index) => `<div class="category-row"><span class="category-dot category-dot-${index + 1}"></span><span>${escapeHtml(item.category)}</span><strong>${item.count}</strong></div>`).join('')}</div>` : '<div class="category-empty"><span>✳</span><p>Your first report will bring this snapshot to life.</p></div>'}</article>
        <article class="side-panel notification-panel"><div class="side-panel-heading"><span class="eyebrow">${t('Updates')}</span><button class="button-quiet" id="read-all-notifications">${t('Mark all read')}</button></div><div class="notification-count">${state.notificationInbox.unreadCount} ${t('unread')}</div>${state.notificationInbox.items.length?state.notificationInbox.items.slice(0,5).map(item=>`<button class="notification-item ${item.readAt?'':'notification-unread'}" data-notification="${item.id}" data-incident="${item.incidentId||''}"><strong>${t(item.title)}</strong><span>${localizedNotification(item)}</span><small>${new Date(item.createdAt).toLocaleString(state.lang==='ru'?'ru-RU':state.lang==='kk'?'kk-KZ':'en-US')}</small></button>`).join(''):`<p class="notification-empty">${t('You are all caught up.')}</p>`}</article>
        <article class="side-panel tip-panel"><span class="tip-icon">✦</span><div><strong>A helpful detail</strong><p>${isStaff ? 'A clear status update helps residents understand what happens next.' : 'Add a nearby landmark to help the city team find the issue faster.'}</p></div></article>
      </aside>
    </section>`;
  applyTranslations();
  document.querySelector('#new-report').onclick = createPage;
  document.querySelector('#download-reports')?.addEventListener('click',downloadReports);
  initCityMap();
  document.querySelectorAll('[data-notification]').forEach(button=>button.onclick=async()=>{try{await api(`/notifications/${button.dataset.notification}/read`,{method:'PATCH'});if(button.dataset.incident){const item=document.querySelector(`[data-history="${button.dataset.incident}"]`);item?.closest('.incident-card')?.scrollIntoView({behavior:'smooth',block:'center'});}dashboard();}catch(error){toast(error.message);}});
  document.querySelector('#read-all-notifications')?.addEventListener('click',async()=>{try{await api('/notifications/read-all',{method:'POST'});dashboard();}catch(error){toast(error.message);}});
  document.querySelector('#assigned-toggle')?.addEventListener('click',()=>{state.showAssigned=!state.showAssigned;renderDashboard(state.showAssigned?state.assignedIncidents:state.incidents);});
  document.querySelector('#manage-users')?.addEventListener('click', manageUsers);
  const refreshFiltered = () => {
    const statusValue=document.querySelector('#status-filter').value, categoryValue=document.querySelector('#category-filter').value, query=document.querySelector('#report-search').value.trim().toLocaleLowerCase();
    const filteredItems = baseItems.filter(item => (statusValue==='ALL'||item.status===statusValue)&&(categoryValue==='ALL'||item.category===categoryValue)&&(!query||`${item.title} ${item.description} ${item.location} ${item.referenceCode}`.toLocaleLowerCase().includes(query)));
    document.querySelector('#incident-list').innerHTML = filteredItems.length ? filteredItems.map(card).join('') : emptyReports(baseItems.length>0);
    const footerCount = document.querySelector('.list-footer span');
    if (footerCount) footerCount.textContent = `${t('Showing')} ${filteredItems.length} ${t('of')} ${baseItems.length} ${t('reports')}`;
    bindStatusButtons();
    applyTranslations(document.querySelector('#incident-list'));
  };
  document.querySelector('#status-filter').addEventListener('change', refreshFiltered);
  document.querySelector('#category-filter').addEventListener('change', refreshFiltered);
  document.querySelector('#report-search').addEventListener('input', refreshFiltered);
  bindStatusButtons();
  observeReveals();
}

function greeting() {
  const hour = new Date().getHours();
  return t(hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening');
}

function localizedNotification(item){
  const match=item.body.match(/^Report (CC-[A-Z0-9]+) (?:is now (.+)|needs your attention)\.$/);
  if(!match)return escapeHtml(item.body);
  return item.type==='STATUS'?`${t('Status')}: ${localizedStatus(match[2].replaceAll(' ','_'))} · ${match[1]}`:`${t('Please review this report')}: ${match[1]}`;
}

function renderAnalytics(data){
  const months=Object.entries(data.monthlyCounts||{}), maxMonth=Math.max(1,...months.map(([,value])=>value));
  const statuses=Object.entries(data.statuses||{}).sort((a,b)=>b[1]-a[1]);
  const categories=Object.entries(data.categories||{}).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const departments=Object.entries(data.departments||{}).sort((a,b)=>b[1]-a[1]).slice(0,4);
  return `<section class="analytics-panel reveal"><div class="analytics-head"><div><div class="eyebrow">${t('City overview')}</div><h2>${t('Service analytics')}</h2><p>${t('Live totals across all submitted reports.')}</p></div><button class="button button-soft button-small" id="download-reports">${t('Download CSV')} <span>↓</span></button></div><div class="analytics-kpis"><article><small>${t('All reports')}</small><strong>${data.total}</strong></article><article><small>${t('Active')}</small><strong>${data.active}</strong></article><article><small>${t('Resolved')}</small><strong>${data.resolved}</strong></article><article><small>${t('Over 7 days')}</small><strong>${data.overdue}</strong></article><article><small>${t('Average resolution')}</small><strong>${data.averageResolutionHours}<em> h</em></strong></article></div><div class="analytics-details"><div class="analytics-chart"><strong>${t('Reports by month')}</strong><div class="month-bars">${months.map(([month,count])=>`<div title="${escapeHtml(month)} · ${count}"><span style="height:${Math.max(4,count/maxMonth*100)}%"></span><small>${escapeHtml(month.slice(5))}</small></div>`).join('')}</div></div><div class="analytics-breakdown"><strong>${t('By status')}</strong>${statuses.map(([status,count])=>`<div><span>${localizedStatus(status)}</span><b>${count}</b></div>`).join('')||`<p>${t('No reports yet.')}</p>`}</div><div class="analytics-breakdown"><strong>${t('Top categories')}</strong>${categories.map(([name,count])=>`<div><span>${escapeHtml(t(name))}</span><b>${count}</b></div>`).join('')||`<p>${t('No reports yet.')}</p>`}</div><div class="analytics-breakdown"><strong>${t('By department')}</strong>${departments.map(([name,count])=>`<div><span>${escapeHtml(name)}</span><b>${count}</b></div>`).join('')||`<p>${t('No assignments yet.')}</p>`}</div></div></section>`;
}

async function downloadReports(){
  try{const response=await fetch('/api/admin/reports.csv',{headers:{Authorization:`Bearer ${state.token}`}});if(!response.ok)throw new Error(t('Could not download the report export.'));const blob=await response.blob();const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='cityconnect-reports.csv';link.click();URL.revokeObjectURL(url);}
  catch(error){toast(error.message);}
}

function emptyReports(hasReports) {
  return hasReports
    ? '<div class="empty empty-filter"><span class="empty-icon">⌕</span><strong>No reports with this status</strong><p>Choose another status to see more updates.</p></div>'
    : `<div class="first-report-card"><div class="first-report-art"><span class="art-sun"></span><span class="art-building art-building-a"></span><span class="art-building art-building-b"></span><span class="art-building art-building-c"></span><span class="art-flag">✳</span></div><div class="first-report-copy"><div class="eyebrow">A good place to begin</div><h3>Your first report can make a difference.</h3><p>Street light out? Sidewalk needs care? Let your city know and keep an eye on the progress.</p><button class="button" id="first-report">Create your first report <span>↗</span></button></div></div>`;
}

function card(incident) {
  const status = incident.status;
  const locale = state.lang === 'ru' ? 'ru-RU' : state.lang === 'kk' ? 'kk-KZ' : 'en-US';
  const date = new Date(incident.createdAt).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  const canEdit=state.user.id===incident.createdById&&status==='NEW';
  const assignedToMe=incident.assignedEmployeeId===state.user.id;
  const internalNoteActions=state.user.role==='ADMIN'||(state.user.role==='EMPLOYEE'&&assignedToMe);
  return `<article class="incident-card"><div class="incident-card-top"><span class="reference-code">${escapeHtml(incident.referenceCode)}</span><span class="status status-${status}"><i></i>${localizedStatus(status)}</span></div><h3>${escapeHtml(incident.title)}</h3><p class="incident-description">${escapeHtml(incident.description)}</p><div class="incident-card-bottom"><div class="incident-details"><span class="category-label"><i class="tiny-category"></i>${escapeHtml(t(incident.category))}</span><span>⌖ ${escapeHtml(incident.location)}</span>${incident.departmentName?`<span>⌘ ${escapeHtml(incident.departmentName)}${incident.assignedEmployee?` · ${escapeHtml(incident.assignedEmployee)}`:''}</span>`:''}</div><div class="incident-byline"><span class="mini-avatar">${escapeHtml(incident.createdBy.slice(0, 1).toUpperCase())}</span><span>${escapeHtml(incident.createdBy)} <small>· ${escapeHtml(date)}</small></span></div></div><div class="incident-actions"><button class="engagement-button ${incident.votedByMe ? 'engagement-active' : ''}" data-vote="${incident.id}" data-voted="${incident.votedByMe}" aria-label="${t(incident.votedByMe ? 'Voted' : 'Vote')}"><span>♡</span> ${t(incident.votedByMe ? 'Voted' : 'Vote')} <strong>${incident.voteCount}</strong></button><button class="engagement-button" data-comments="${incident.id}"><span>▤</span> ${t('Comments')} <strong>${incident.commentCount}</strong></button><button class="engagement-button" data-history="${incident.id}">${t('Status history')}</button>${internalNoteActions?`<button class="engagement-button" data-internal-notes="${incident.id}">${t('Internal notes')}</button>`:''}${canEdit ? `<button class="engagement-button" data-edit-incident="${incident.id}">${t('Edit report')}</button>` : ''}<span class="engagement-spacer"></span><span class="report-support-label">${t('Report support')}</span></div><div class="comments-panel" id="comments-${incident.id}" hidden></div><div class="history-panel" id="history-${incident.id}" hidden></div><div class="history-panel" id="internal-notes-${incident.id}" hidden></div>${state.user.role !== 'CITIZEN' ? `<div class="status-editor"><label for="status-${incident.id}">Update progress</label><select id="status-${incident.id}" data-status-select="${incident.id}">${STATUSES.map(item => `<option value="${item}" ${status === item ? 'selected' : ''}>${localizedStatus(item)}</option>`).join('')}</select><input data-status-note="${incident.id}" maxlength="500" placeholder="Optional update note"><button class="button button-soft button-small" data-id="${incident.id}" data-save-status>${t('Save update')}</button></div>` : ''}${state.user.role==='ADMIN'?`<div class="assignment-editor"><label>${t('Department')}</label><select data-assignment-department="${incident.id}"><option value="">${t('Unassigned')}</option>${state.departments.map(d=>`<option value="${d.id}" ${incident.departmentId===d.id?'selected':''}>${escapeHtml(d.name)}</option>`).join('')}</select><label>${t('Assigned employee')}</label><select data-assignment-employee="${incident.id}"><option value="">${t('Unassigned')}</option>${state.employees.filter(e=>e.departmentId===incident.departmentId).map(e=>`<option value="${e.id}" ${incident.assignedEmployeeId===e.id?'selected':''}>${escapeHtml(e.fullName)}</option>`).join('')}</select><button class="button button-soft button-small" data-save-assignment="${incident.id}">${t('Save assignment')}</button></div>`:''}</article>`;
}

function bindStatusButtons() {
  document.querySelectorAll('[data-save-status]').forEach(button => {
    button.onclick = () => changeStatus(button.dataset.id);
  });
  document.querySelectorAll('[data-vote]').forEach(button => button.onclick = () => toggleVote(button));
  document.querySelectorAll('[data-comments]').forEach(button => button.onclick = () => toggleComments(button));
  document.querySelectorAll('[data-history]').forEach(button => button.onclick = () => toggleHistory(button));
  document.querySelectorAll('[data-edit-incident]').forEach(button => button.onclick = () => editIncident(button.dataset.editIncident));
  document.querySelectorAll('[data-internal-notes]').forEach(button => button.onclick = () => toggleInternalNotes(button));
  document.querySelectorAll('[data-save-assignment]').forEach(button=>button.onclick=()=>saveAssignment(button.dataset.saveAssignment));
  document.querySelectorAll('[data-assignment-department]').forEach(select=>select.onchange=()=>{
    const id=select.dataset.assignmentDepartment, employeeSelect=document.querySelector(`[data-assignment-employee="${id}"]`);
    const eligible=state.employees.filter(employee=>String(employee.departmentId)===select.value);
    employeeSelect.innerHTML=`<option value="">${t('Unassigned')}</option>${eligible.map(employee=>`<option value="${employee.id}">${escapeHtml(employee.fullName)}</option>`).join('')}`;
  });
  document.querySelector('#first-report')?.addEventListener('click', createPage);
}

async function saveAssignment(id){
  const departmentId=document.querySelector(`[data-assignment-department="${id}"]`).value||null;
  const employeeId=document.querySelector(`[data-assignment-employee="${id}"]`).value||null;
  try{await api(`/admin/incidents/${id}/assignment`,{method:'PATCH',body:JSON.stringify({departmentId:departmentId?Number(departmentId):null,employeeId:employeeId?Number(employeeId):null})});toast(t('Assignment saved.'));dashboard();}
  catch(error){toast(error.message);}
}

async function toggleInternalNotes(button){
  const id=button.dataset.internalNotes,panel=document.querySelector(`#internal-notes-${id}`);
  if(!panel.hidden){panel.hidden=true;return;}
  panel.hidden=false;panel.innerHTML=`<div class="loading-comments"><span class="loading-orb"></span>${t('Loading comments…')}</div>`;
  try{const items=await api(`/incidents/${id}/internal-notes`);panel.innerHTML=`<strong>${t('Internal notes')}</strong><div class="internal-note-list">${items.map(item=>`<div class="history-entry"><span class="history-dot"></span><div><strong>${escapeHtml(item.author)}</strong><small>${new Date(item.createdAt).toLocaleString()}</small><p>${escapeHtml(item.body)}</p></div></div>`).join('')||`<p>${t('No internal notes yet.')}</p>`}</div><form class="internal-note-form"><input name="body" maxlength="2000" placeholder="${t('Write an internal note…')}" required><button class="button button-small">${t('Add note')}</button></form>`;
    panel.querySelector('form').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget;try{await api(`/incidents/${id}/internal-notes`,{method:'POST',body:JSON.stringify({body:form.body.value.trim()})});button.click();button.click();}catch(error){toast(error.message);}};
  }catch(error){panel.textContent=error.message;}
}

async function toggleHistory(button){
  const id=button.dataset.history, panel=document.querySelector(`#history-${id}`);
  if(!panel.hidden){panel.hidden=true;return;}
  panel.hidden=false; panel.innerHTML=`<div class="loading-comments"><span class="loading-orb"></span>${t('Loading comments…')}</div>`;
  try{const entries=await api(`/incidents/${id}/history`);panel.innerHTML=entries.map(entry=>`<div class="history-entry"><span class="history-dot"></span><div><strong>${entry.fromStatus?`${localizedStatus(entry.fromStatus)} → `:''}${localizedStatus(entry.toStatus)}</strong><small>${escapeHtml(entry.changedBy)} · ${new Date(entry.createdAt).toLocaleString()}</small>${entry.note?`<p>${escapeHtml(entry.note)}</p>`:''}</div></div>`).join('');}
  catch(error){panel.textContent=error.message;}
}

async function editIncident(id){
  const item=state.incidents.find(report=>String(report.id)===String(id)); if(!item)return;
  const cardNode=document.querySelector(`[data-edit-incident="${id}"]`).closest('.incident-card');
  cardNode.insertAdjacentHTML('beforeend',`<form class="incident-edit-form"><div class="field"><label>${t('Issue title')}</label><input name="title" value="${escapeHtml(item.title)}" maxlength="120" required></div><div class="field"><label>${t('A little more detail')}</label><textarea name="description" maxlength="3000" required>${escapeHtml(item.description)}</textarea></div><div class="form-row"><div class="field"><label>${t('Category')}</label><select name="category">${CATEGORIES.map(category=>`<option value="${escapeHtml(category)}" ${category===item.category?'selected':''}>${escapeHtml(t(category))}</option>`).join('')}</select></div><div class="field"><label>${t('Location')}</label><input name="location" value="${escapeHtml(item.location)}" maxlength="200" required></div></div><div class="coordinate-fields"><label>${t('Latitude')}<input name="latitude" type="number" step="any" value="${item.latitude??''}"></label><label>${t('Longitude')}<input name="longitude" type="number" step="any" value="${item.longitude??''}"></label></div><button class="button button-small">${t('Save update')}</button> <button type="button" class="button-quiet" data-cancel-edit>${t('Cancel')}</button></form>`);
  const form=cardNode.querySelector('.incident-edit-form'); form.querySelector('[data-cancel-edit]').onclick=()=>form.remove();
  form.onsubmit=async event=>{event.preventDefault();try{const payload=Object.fromEntries(new FormData(form));payload.latitude=payload.latitude?Number(payload.latitude):null;payload.longitude=payload.longitude?Number(payload.longitude):null;await api(`/incidents/${id}`,{method:'PATCH',body:JSON.stringify(payload)});toast(t('Report updated.'));dashboard();}catch(error){showMessage(form,error.message);}};
}

async function toggleVote(button) {
  const id = button.dataset.vote;
  button.disabled = true;
  try {
    await api(`/incidents/${id}/vote`, { method: button.dataset.voted === 'true' ? 'DELETE' : 'PUT' });
    await dashboard();
  } catch (error) {
    toast(error.message);
    button.disabled = false;
  }
}

async function toggleComments(button) {
  const id = button.dataset.comments;
  const panel = document.querySelector(`#comments-${id}`);
  if (!panel.hidden) {
    panel.hidden = true;
    button.querySelector('span').textContent = '▤';
    return;
  }
  panel.hidden = false;
  panel.innerHTML = `<div class="loading-comments"><span class="loading-orb"></span>${t('Loading comments…')}</div>`;
  try {
    const comments = await api(`/incidents/${id}/comments`);
    panel.innerHTML = `<div class="comments-heading"><strong>${t('Comments')}</strong><span>${comments.length}</span></div><div class="comments-list">${comments.length ? comments.map(comment => `<article class="comment-item"><span class="mini-avatar">${escapeHtml(comment.author.slice(0, 1).toUpperCase())}</span><div><strong>${escapeHtml(comment.author)}</strong><p>${escapeHtml(comment.body)}</p></div></article>`).join('') : `<p class="no-comments">${t('No comments yet. Start the conversation.')}</p>`}</div><form class="comment-form" data-comment-form="${id}"><label class="sr-only" for="comment-${id}">${t('Add a comment')}</label><input id="comment-${id}" name="body" maxlength="1000" placeholder="${t('Write a helpful update…')}" required><button class="button button-small">${t('Post comment')}</button></form>`;
    applyTranslations(panel);
    panel.querySelector('form').onsubmit = event => postComment(event, id);
  } catch (error) {
    panel.innerHTML = `<p class="no-comments">${t('Could not load comments.')}</p>`;
    toast(error.message);
  }
}

async function postComment(event, id) {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector('button');
  button.disabled = true;
  try {
    await api(`/incidents/${id}/comments`, { method: 'POST', body: JSON.stringify({ body: form.body.value.trim() }) });
    toast(t('Comment added.'));
    await dashboard();
    const commentsButton = document.querySelector(`[data-comments="${id}"]`);
    if (commentsButton) await toggleComments(commentsButton);
  } catch (error) {
    toast(error.message);
    button.disabled = false;
  }
}

function createPage() {
  app.innerHTML = `<section class="form-layout"><div class="form-intro"><button class="back-home" id="back">← Back to reports</button><div class="form-intro-art"><span class="form-spark">✳</span><span class="form-ring"></span><span class="form-pin">⌖</span></div><div class="eyebrow">A clear report goes a long way</div><h1>Tell us what<br>needs attention.</h1><p>Share a few details so the right city team can understand the issue and take a closer look.</p><div class="form-promise"><span>✓</span> Your report is saved securely to your account.</div></div><form class="report-form reveal"><div class="form-step"><span>01</span><div><h2>Describe the issue</h2><p>Start with the detail that matters most.</p></div></div><div class="field"><label for="title">Issue title</label><input id="title" name="title" maxlength="120" placeholder="e.g. Street light out on Abay Avenue" required></div><div class="field"><label for="description">A little more detail</label><textarea id="description" name="description" maxlength="3000" placeholder="What happened? When did you notice it? Any detail that could help the city team?" required></textarea><small class="field-hint">A few clear sentences are usually enough.</small></div><div class="form-divider"></div><div class="form-step"><span>02</span><div><h2>Help us locate it</h2><p>Choose a category and add a nearby location.</p></div></div><div class="form-row"><div class="field"><label for="category">Category</label><select id="category" name="category" required><option value="">Choose category</option>${CATEGORIES.map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join('')}</select></div><div class="field"><label for="location">Location</label><input id="location" name="location" maxlength="200" placeholder="Street, area or landmark" required></div></div><div class="location-note"><span>⌖</span><p>Include a street name, building, or landmark so the team can find the spot.</p></div><button class="button button-full submit-report">Submit report <span>↗</span></button><p class="form-privacy">By submitting, you confirm these details are accurate to the best of your knowledge.</p></form></section>`;
  applyTranslations();
  document.querySelector('#back').onclick = dashboard;
  const form = app.querySelector('form');
  form.querySelector('.location-note').insertAdjacentHTML('afterend',`<div class="coordinate-fields"><label>${t('Latitude')}<input id="latitude" name="latitude" type="number" step="any" min="-90" max="90" placeholder="43.65"></label><label>${t('Longitude')}<input id="longitude" name="longitude" type="number" step="any" min="-180" max="180" placeholder="51.16"></label><button type="button" class="button button-soft button-small" id="use-location">${t('Use my location')}</button></div><p class="field-hint">${t('Coordinates are optional and help show this report on the map.')}</p>`);
  document.querySelector('#use-location').onclick=()=>{
    if(!navigator.geolocation)return toast(t('Location access is unavailable in this browser.'));
    navigator.geolocation.getCurrentPosition(position=>{form.latitude.value=position.coords.latitude.toFixed(6);form.longitude.value=position.coords.longitude.toFixed(6);},()=>toast(t('Could not access your location. Enter coordinates manually.')),{enableHighAccuracy:true,timeout:10000});
  };
  form.onsubmit = async event => {
    event.preventDefault();
    const button = form.querySelector('.submit-report');
    button.disabled = true;
    button.innerHTML = `<span class="button-spinner"></span> ${t('Sending your report…')}`;
    try {
      const payload=Object.fromEntries(new FormData(form));payload.latitude=payload.latitude?Number(payload.latitude):null;payload.longitude=payload.longitude?Number(payload.longitude):null;
      await api('/incidents', { method: 'POST', body: JSON.stringify(payload) });
      toast(t('Report submitted. Thank you for speaking up.'));
      dashboard();
    } catch (error) {
      showMessage(form, error.message);
    } finally {
      button.disabled = false;
      button.innerHTML = `${t('Submit report')} <span>↗</span>`;
    }
  };
  observeReveals();
}

async function changeStatus(id) {
  const select = document.querySelector(`select[data-status-select="${id}"]`);
  const button = document.querySelector(`[data-save-status][data-id="${id}"]`);
  button.disabled = true;
  try {
    await api(`/incidents/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: select.value, note: document.querySelector(`[data-status-note="${id}"]`)?.value || null }) });
    toast('Report status updated.');
    dashboard();
  } catch (error) {
    toast(error.message);
    button.disabled = false;
  }
}

async function manageUsers() {
  try {
    const [users,departments]=await Promise.all([api('/admin/users'),api('/admin/departments')]);
    app.innerHTML = `<section class="manage-page"><div class="manage-head"><button class="back-home" id="back">← Back to reports</button><div class="eyebrow">City administration</div><h1>People make the city.</h1><p>Manage team access, departments and community roles from one place.</p></div><form class="department-create" id="department-form"><strong>${t('Departments')}</strong><div class="department-create-fields"><input name="name" maxlength="100" placeholder="${t('Department name')}" required><input name="description" maxlength="500" placeholder="${t('Department description')}"><button class="button button-small">${t('Add department')}</button></div><div class="department-chips">${departments.map(department=>`<span>${escapeHtml(department.name)}${department.description?`<small>${escapeHtml(department.description)}</small>`:''}</span>`).join('')||`<small>${t('No departments yet.')}</small>`}</div></form><div class="user-management">${users.map(user => `<article class="user-row"><span class="avatar avatar-large">${escapeHtml((user.fullName || user.username).slice(0, 1).toUpperCase())}</span><div class="user-row-copy"><strong>${escapeHtml(user.fullName || user.username)}</strong><span>${escapeHtml(user.email)}</span></div><span class="role-pill role-${user.role.toLowerCase()}">${localizedRole(user.role)}</span><label class="sr-only" for="role-${user.id}">Role for ${escapeHtml(user.username)}</label><select id="role-${user.id}" data-role="${user.id}"><option value="CITIZEN" ${user.role === 'CITIZEN' ? 'selected' : ''}>${localizedRole('CITIZEN')}</option><option value="EMPLOYEE" ${user.role === 'EMPLOYEE' ? 'selected' : ''}>${localizedRole('EMPLOYEE')}</option><option value="ADMIN" ${user.role === 'ADMIN' ? 'selected' : ''}>${localizedRole('ADMIN')}</option></select>${user.role==='EMPLOYEE'?`<select data-user-department="${user.id}" aria-label="${t('Department')}"><option value="">${t('No department')}</option>${departments.map(department=>`<option value="${department.id}" ${user.departmentId===department.id?'selected':''}>${escapeHtml(department.name)}</option>`).join('')}</select>`:'<span></span>'}<div class="user-actions"><button data-user="${user.id}" class="button button-soft button-small">${t('Save role')}</button>${user.role==='EMPLOYEE'?`<button data-save-user-department="${user.id}" class="button-quiet">${t('Save department')}</button>`:''}<button data-reset-user="${user.id}" class="button-quiet">${t('Issue reset code')}</button></div><div class="reset-code-box" data-reset-code="${user.id}" hidden></div></article>`).join('')}</div></section>`;
    applyTranslations();
    document.querySelector('#back').onclick = dashboard;
    document.querySelector('#department-form').onsubmit=async event=>{event.preventDefault();const form=event.currentTarget;try{await api('/admin/departments',{method:'POST',body:JSON.stringify({name:form.name.value.trim(),description:form.description.value.trim()||null})});toast(t('Department created.'));manageUsers();}catch(error){showMessage(form,error.message);}};
    document.querySelectorAll('[data-save-user-department]').forEach(button=>button.onclick=async()=>{const userId=button.dataset.saveUserDepartment,departmentId=document.querySelector(`[data-user-department="${userId}"]`).value;try{await api(`/admin/users/${userId}/department`,{method:'PATCH',body:JSON.stringify({departmentId:departmentId?Number(departmentId):null})});toast(t('Department assignment saved.'));manageUsers();}catch(error){toast(error.message);}});
    document.querySelectorAll('[data-user]').forEach(button => button.onclick = async () => {
      const id = button.dataset.user;
      button.disabled = true;
      try {
        await api(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role: document.querySelector(`[data-role="${id}"]`).value }) });
        toast('Role updated.');
        manageUsers();
      } catch (error) {
        toast(error.message);
        button.disabled = false;
      }
    });
    document.querySelectorAll('[data-reset-user]').forEach(button => button.onclick = async () => {
      const id = button.dataset.resetUser;
      button.disabled = true;
      try {
        const reset = await api(`/admin/users/${id}/password-reset`, { method: 'POST' });
        const panel = document.querySelector(`[data-reset-code="${id}"]`);
        panel.hidden = false;
        panel.innerHTML = `<div><strong>${t('Reset code for')} ${escapeHtml(reset.username)}</strong><p>${t('Share this one-time code with the account owner through a trusted channel.')}</p><code>${escapeHtml(reset.token)}</code><small>${t('Code expires in 30 minutes.')}</small></div><button class="button button-soft button-small" data-copy-reset="${id}">${t('Copy code')}</button>`;
        panel.querySelector('[data-copy-reset]').onclick = async () => {
          try { await navigator.clipboard.writeText(reset.token); toast(t('Code copied. Share it with the account owner.')); }
          catch { toast(reset.token); }
        };
        applyTranslations(panel);
      } catch (error) { toast(error.message); }
      finally { button.disabled = false; }
    });
    observeReveals();
  } catch (error) {
    toast(error.message);
  }
}

function toast(message) {
  const element = document.createElement('div');
  element.className = 'toast';
  element.textContent = t(message);
  document.body.append(element);
  requestAnimationFrame(() => element.classList.add('toast-visible'));
  setTimeout(() => element.remove(), 3200);
}

function observeReveals() {
  const elements = document.querySelectorAll('.reveal:not(.is-visible)');
  if (!('IntersectionObserver' in window)) return elements.forEach(element => element.classList.add('is-visible'));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.08 });
  elements.forEach(element => observer.observe(element));
}

window.addEventListener('hashchange', render);
if (state.token) api('/auth/me').then(user => { state.user = user; render(); }).catch(logout);
else render();
