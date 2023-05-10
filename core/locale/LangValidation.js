/**
 * Default error message
 */
const langValidation = Object.freeze({
    required: {
        "en": "The _attribute_ is required",
        "id": "_attribute_ wajib di isi",
        "es": "El campo _attribute_ es obligatorio",
        "hi": "_attribute_ आवश्यक है",
        "ru": "Поле _attribute_ является обязательным",
        "pt": "O campo _attribute_ é obrigatório",
        "zh": "_attribute_ 必填",
        "ja": "_attribute_ は必須です"
    },
    email: {
        "en": "The _attribute_ must be in E-mail format",
        "id": "_attribute_ harus dalam format E-mail",
        "es": "El campo _attribute_ debe ser un correo electrónico",
        "hi": "_attribute_ ईमेल फॉर्मेट में होना चाहिए",
        "ru": "Поле _attribute_ должно быть в формате электронной почты",
        "pt": "O campo _attribute_ deve estar em formato de e-mail",
        "zh": "_attribute_ 必须是电子邮件格式",
        "ja": "_attribute_ はメールアドレス形式である必要があります"
    },
    match: {
        "en": "The _attribute_ must be match with _param1_",
        "id": "_attribute_ harus sama dengan _param1_",
        "es": "El campo _attribute_ debe coincidir con _param1_",
        "hi": "_attribute_ _param1_ से मेल खाना चाहिए",
        "ru": "Поле _attribute_ должно совпадать с _param1_",
        "pt": "O campo _attribute_ deve corresponder a _param1_",
        "zh": "_attribute_ 必须与 _param1_ 相匹配",
        "ja": "_attribute_ は _param1_ と一致する必要があります"
    },
    string: {
        "en": "The _attribute_ must be in string format",
        "id": "_attribute_ harus dalam format string",
        "es": "El campo _attribute_ debe estar en formato de texto",
        "hi": "_attribute_ स्ट्रिंग फॉर्मेट में होना चाहिए",
        "ru": "Поле _attribute_ должно быть в формате строки",
        "pt": "O campo _attribute_ deve estar no formato de string",
        "zh": "_attribute_ 必须为字符串格式",
        "ja": "_attribute_ は文字列形式である必要があります"
    },
    float: {
        "en": "The _attribute_ must be numeric",
        "id": "_attribute_ harus dalam format angka",
        "es": "El _attribute_ debe ser numérico",
        "hi": "_attribute_ संख्यात्मक होना चाहिए",
        "ru": "_attribute_ должно быть числовым",
        "pt": "O _attribute_ deve ser numérico",
        "zh": "_attribute_ 必须为数字",
        "ja": "_attribute_ は数値でなければなりません"
    },
    integer: {
        "en": "The _attribute_ must be integer",
        "id": "_attribute_ harus bilangan bulat",
        "es": "El _attribute_ debe ser entero",
        "hi": "_attribute_ पूर्णांक होना चाहिए",
        "ru": "_attribute_ должно быть целочисленным",
        "pt": "O _attribute_ deve ser um número inteiro",
        "zh": "_attribute_ 必须是整数",
        "ja": "_attribute_ は整数でなければなりません"
    },
    max: {
        "en": "The _attribute_ should be less or equal then _param1_",
        "id": "_attribute_ harus kurang atau sama dengan _param1_",
        "es": "El _attribute_ debe ser menor o igual que _param1_",
        "hi": "_attribute_ _param1_ से कम या बराबर होना चाहिए",
        "ru": "_attribute_ должно быть меньше или равно _param1_",
        "pt": "O _attribute_ deve ser menor ou igual a _param1_",
        "zh": "_attribute_ 应该小于或等于 _param1_",
        "ja": "_attribute_ は _param1_ 以下でなければなりません"
    },
    min: {
        "en": "The _attribute_ should be more or equal then _param1_",
        "id": "_attribute_ harus lebih atau sama dengan _param1_",
        "es": "El _attribute_ debe ser mayor o igual que _param1_",
        "hi": "_attribute_ _param1_ से अधिक या बराबर होना चाहिए",
        "ru": "_attribute_ должно быть больше или равно _param1_",
        "pt": "O _attribute_ deve ser maior ou igual a _param1_",
        "zh": "_attribute_ 应该大于或等于 _param1_",
        "ja": "_attribute_ は _param1_ 以上でなければなりません"
    },
    date: {
        "en": "The _attribute_ must be in date format",
        "id": "_attribute_ harus dalam format tanggal",
        "es": "El campo _attribute_ debe estar en formato fecha",
        "hi": "_attribute_ तिथि प्रारूप में होना चाहिए",
        "ru": "Поле _attribute_ должно быть в формате даты",
        "pt": "O campo _attribute_ deve estar em formato de data",
        "zh": "_attribute_必须是日期格式",
        "ja": "_attribute_は日付形式でなければなりません"
    },
    array: {
        "en": "The _attribute_ must be in array format",
        "id": "_attribute_ harus dalam format array",
        "es": "El campo _attribute_ debe estar en formato de arreglo",
        "hi": "_attribute_ एक सरणी प्रारूप में होना चाहिए",
        "ru": "Поле _attribute_ должно быть в формате массива",
        "pt": "O campo _attribute_ deve estar em formato de array",
        "zh": "_attribute_必须是数组格式",
        "ja": "_attribute_は配列形式でなければなりません"
    },
    exists: {
        "en": "The _attribute_ not recorded",
        "id": "_attribute_ tidak terdaftar",
        "es": "El _attribute_ no está registrado",
        "hi": "_attribute_ दर्ज नहीं हुआ",
        "ru": "_attribute_ не зарегистрирован",
        "pt": "O _attribute_ não está registrado",
        "zh": "_attribute_ 没有记录",
        "ja": "_attribute_ は記録されていません"
    },
    unique: {
        "en": "The _attribute_ already used",
        "id": "_attribute_ sudah digunakan",
        "es": "El _attribute_ ya ha sido utilizado",
        "hi": "_attribute_ पहले से ही उपयोग में है",
        "ru": "_attribute_ уже используется",
        "pt": "O _attribute_ já está sendo usado",
        "zh": "_attribute_ 已经被使用",
        "ja": "_attribute_ はすでに使用されています"
    },
    mimetypes: {
        "en": "The _attribute_ must be in file format of _param1_",
        "id": "_attribute_ harus dalam format file dari _param1_",
        "es": "El _attribute_ debe estar en el formato de archivo _param1_",
        "hi": "_attribute_ _param1_ फ़ाइल प्रारूप में होना चाहिए",
        "ru": "_attribute_ должен быть в формате файла _param1_",
        "pt": "O _attribute_ deve estar no formato de arquivo _param1_",
        "zh": "_attribute_ 必须是 _param1_ 文件格式",
        "ja": "_attribute_ はファイル形式が _param1_ でなければなりません"
    },
    mimes: {
        "en": "The _attribute_ must be in have extention of _param1_",
        "id": "_attribute_ harus memiliki extensi _param1_",
        "es": "El _attribute_ debe tener la extensión _param1_",
        "hi": "_attribute_ के पास _param1_ एक्सटेंशन होना चाहिए",
        "ru": "_attribute_ должен иметь расширение _param1_",
        "pt": "O _attribute_ deve ter a extensão _param1_",
        "zh": "_attribute_ 必须有 _param1_ 扩展名",
        "ja": "_attribute_ は _param1_ 拡張子を持っている必要があります"
    },
    max_file: {
        "en": "The _attribute_ should have file size less or equal then _param1_ _param2_",
        "id": "_attribute_ harus memiliki ukuran file kurang atau sama dengan _param1_ _param2_",
        "es": "El archivo _attribute_ debe tener un tamaño menor o igual que _param1_ _param2_",
        "hi": "फ़ाइल _attribute_ का आकार _param1_ _param2_ से कम या बराबर होना चाहिए",
        "ru": "Размер файла _attribute_ должен быть меньше или равен _param1_ _param2_",
        "pt": "O tamanho do arquivo _attribute_ deve ser menor ou igual a _param1_ _param2_",
        "zh": "_attribute_ 文件大小应小于等于 _param1_ _param2_",
        "ja": "_attribute_ のファイルサイズは _param1_ _param2_以下である必要があります"
    },
    image: {
        "en": "The _attribute_ should be image format",
        "id": "_attribute_ harus dalam format gambar",
        "es": "El archivo _attribute_ debe ser de formato imagen",
        "hi": "_attribute_ का फ़ॉर्मेट छवि होना चाहिए",
        "ru": "Формат файла _attribute_ должен быть изображением",
        "pt": "O formato do arquivo _attribute_ deve ser de imagem",
        "zh": "_attribute_ 应为图像格式",
        "ja": "_attribute_ は画像形式である必要があります"
    },
    date_after: {
        "en": "The _attribute_ date must be after _param1_'s date",
        "id": "_attribute_ harus setelah tanggal _param1_",
        "es": "La fecha de _attribute_ debe ser posterior a la fecha de _param1_",
        "hi": "_attribute_ तिथि _param1_ की तिथि के बाद होनी चाहिए",
        "ru": "Дата _attribute_ должна быть после даты _param1_",
        "pt": "A data de _attribute_ deve ser posterior à data de _param1_",
        "zh": "_attribute_ 日期必须在 _param1_ 日期之后",
        "ja": "_attribute_ の日付は_param1_の日付の後でなければなりません"
    },
    date_after_or_equal: {
        "en": "The _attribute_ date must be after or equal than _param1_'s date",
        "id": "_attribute_ harus setelah atau sama dengan tanggal _param1_",
        "es": "La fecha de _attribute_ debe ser posterior o igual a la fecha de _param1_",
        "hi": "_attribute_ की तारीख _param1_ की तारीख के बाद या उससे बराबर होनी चाहिए",
        "ru": "Дата _attribute_ должна быть после или равна дате _param1_",
        "pt": "A data do(a) _attribute_ deve ser posterior ou igual à data do(a) _param1_",
        "zh": "_attribute_ 的日期必须在 _param1_ 的日期之后或相同",
        "ja": "_attribute_の日付は、_param1_の日付以降または同じでなければなりません"
    },
    date_before: {
        "en": "The _attribute_ date must be before _param1_'s date",
        "id": "_attribute_ harus sebelum tanggal _param1_",
        "es": "La fecha de _attribute_ debe ser anterior a la fecha de _param1_",
        "hi": "_attribute_ की तारीख _param1_ की तारीख से पहले होनी चाहिए",
        "ru": "Дата _attribute_ должна быть до даты _param1_",
        "pt": "A data do(a) _attribute_ deve ser anterior à data do(a) _param1_",
        "zh": "_attribute_ 的日期必须在 _param1_ 的日期之前",
        "ja": "_attribute_の日付は、_param1_の日付よりも前でなければなりません"
    },
    date_before_or_equal: {
        "en": "The _attribute_ date must be before or equal than _param1_'s date",
        "id": "_attribute_ harus sebelum atau sama dengan tanggal _param1_",
        "es": "La fecha de _attribute_ debe ser anterior o igual a la fecha de _param1_",
        "hi": "_attribute_ की तारीख _param1_ की तारीख से पहले या उससे बराबर होनी चाहिए",
        "ru": "Дата _attribute_ должна быть до или равна дате _param1_",
        "pt": "A data do(a) _attribute_ deve ser anterior ou igual à data do(a) _param1_",
        "zh": "_attribute_ 的日期必须在 _param1_ 的日期之前或相同",
        "ja": "_attribute_の日付は、_param1_の日付以前または同じでなければなりません"
    },
    boolean: {
        "en": "The _attribute_ must be have true or false format",
        "id": "_attribute_ harus dalam format benar atau salah",
        "es": "El campo _attribute_ debe estar en formato verdadero o falso",
        "hi": "_attribute_ सही या गलत फ़ॉर्मेट में होना चाहिए",
        "ru": "_attribute_ должно быть в формате true или false",
        "pt": "_attribute_ deve estar no formato verdadeiro ou falso",
        "zh": "_attribute_ 必须是 true 或 false 格式",
        "ja": "_attribute_ は true または false の形式でなければなりません"
    },
    in_array: {
        "en": "The _attribute_ selected field is invalid",
        "id": "_attribute_ terpilih tidak valid",
        "es": "El campo seleccionado en _attribute_ no es válido",
        "hi": "_attribute_ चयनित फ़ील्ड अमान्य है",
        "ru": "Выбранное поле в _attribute_ недопустимо",
        "pt": "O campo selecionado em _attribute_ não é válido",
        "zh": "_attribute_ 中选择的字段无效",
        "ja": "_attribute_ で選択されたフィールドが無効です"
    },
    not_in_array: {
        "en": "The _attribute_ selected field is invalid",
        "id": "_attribute_ terpilih tidak valid",
        "es": "El campo seleccionado en _attribute_ no es válido",
        "hi": "_attribute_ चयनित फ़ील्ड अमान्य है",
        "ru": "Выбранное поле в _attribute_ недопустимо",
        "pt": "O campo selecionado em _attribute_ não é válido",
        "zh": "_attribute_ 中选择的字段无效",
        "ja": "_attribute_ で選択されたフィールドが無効です"
    },
    ip: {
        "en": "The _attribute_ must an Ip address",
        "id": "_attribute_ harus dalam format Ip address",
        "es": "El campo _attribute_ debe ser una dirección IP",
        "hi": "_attribute_ एक आईपी ​​पता होना चाहिए",
        "ru": "_attribute_ должно быть IP-адресом",
        "pt": "_attribute_ deve ser um endereço de IP",
        "zh": "_attribute_ 必须是一个 IP 地址",
        "ja": "_attribute_ はIPアドレスでなければなりません"
    },
    url: {
        "en": "The _attribute_ must be an Url",
        "id": "_attribute_ harus berupa Url",
        "es": "El _attribute_ debe ser una URL",
        "hi": "_attribute_ एक Url होना चाहिए",
        "ru": "_attribute_ должен быть Url",
        "pt": "O _attribute_ deve ser um Url",
        "zh": "_attribute_ 必须是一个 Url",
        "ja": "_attribute_はURLである必要があります"
    },
    json: {
        "en": "The _attribute_ must be in Json format",
        "id": "_attribute_ harus berupa format Json",
        "es": "El _attribute_ debe estar en formato Json",
        "hi": "_attribute_ Json प्रारूप में होना चाहिए",
        "ru": "_attribute_ должен быть в формате Json",
        "pt": "O _attribute_ deve estar em formato Json",
        "zh": "_attribute_ 必须是Json格式",
        "ja": "_attribute_はJson形式である必要があります"
    },
    digits: {
        "en": "The _attribute_ must be _param1_ digits",
        "id": "_attribute_ harus _param1_ digit",
        "es": "El _attribute_ debe tener _param1_ dígitos",
        "hi": "_attribute_ _param1_ अंक होना चाहिए",
        "ru": "_attribute_ должен быть _param1_ цифр",
        "pt": "O _attribute_ deve ter _param1_ dígitos",
        "zh": "_attribute_ 必须为_param1_位数字",
        "ja": "_attribute_は_param1_桁である必要があります"
    },
    max_digits: {
        "en": "The _attribute_ must be less or equal than _param1_ digits",
        "id": "_attribute_ harus kurang atau sama dengan _param1_ digit",
        "es": "El _attribute_ debe tener menos o igual que _param1_ dígitos",
        "hi": "_attribute_ _param1_ अंक से कम या बराबर होना चाहिए",
        "ru": "_attribute_ должен быть меньше или равен _param1_ цифр",
        "pt": "O _attribute_ deve ter menos ou igual a _param1_ dígitos",
        "zh": "_attribute_ 必须少于或等于_param1_位数字",
        "ja": "_attribute_は_param1_桁以下である必要があります"
    },
    min_digits: {
        "en": "The _attribute_ must be more or equal than _param1_ digits",
        "id": "_attribute_ harus lebih atau sama dengan _param1_ digit",
        "es": "El campo _attribute_ debe tener como mínimo _param1_ dígitos",
        "hi": "_attribute_ कम से कम _param1_ अंकों से अधिक होना चाहिए",
        "ru": "Длина поля _attribute_ должна быть не менее _param1_ цифр",
        "pt": "O campo _attribute_ deve ter no mínimo _param1_ dígitos",
        "zh": "_attribute_字段的长度不能小于_param1_个数字",
        "ja": "_attribute_は、最低でも_param1_桁以上必要です"
    },
    digits_between: {
        "en": "The _attribute_ must be between _param1_ and _param2_ digits",
        "id": "_attribute_ harus diantara _param1_ dan _param2_ digit",
        "es": "El campo _attribute_ debe tener entre _param1_ y _param2_ dígitos",
        "hi": "_attribute_ कम से कम _param1_ और अधिकतम _param2_ अंकों के बीच होना चाहिए",
        "ru": "Длина поля _attribute_ должна быть между _param1_ и _param2_ цифрами",
        "pt": "O campo _attribute_ deve ter entre _param1_ e _param2_ dígitos",
        "zh": "_attribute_字段的长度应在_param1_和_param2_个数字之间",
        "ja": "_attribute_は_param1_桁以上_param2_桁以下でなければなりません"
    },
    age_lt: {
        "en": "The _attribute_ must be less than _param1_ years",
        "id": "_attribute_ harus kurang dari _param1_ tahun",
        "es": "El _attribute_ debe ser menor que _param1_ años",
        "hi": "_attribute_ _param1_ साल से कम होना चाहिए",
        "ru": "_attribute_ должен быть меньше _param1_ лет",
        "pt": "O(a) _attribute_ deve ser menor que _param1_ anos",
        "zh": "_attribute_ 必须小于 _param1_ 岁",
        "ja": "_attribute_は_param1_歳以下でなければなりません"
    },
    age_lte: {
        "en": "The _attribute_ must be less than or equal to _param1_ years",
        "id": "_attribute_ harus kurang atau sama dengan _param1_ tahun",
        "es": "El _attribute_ debe ser menor o igual a _param1_ años",
        "hi": "_attribute_ _param1_ साल से कम या बराबर होना चाहिए",
        "ru": "_attribute_ должен быть меньше или равен _param1_ годам",
        "pt": "O(a) _attribute_ deve ser menor ou igual a _param1_ anos",
        "zh": "_attribute_ 必须小于或等于 _param1_ 岁",
        "ja": "_attribute_は_param1_歳以下である必要があります"
    },
    age_gt: {
        "en": "The _attribute_ must be greater than _param1_ years",
        "id": "_attribute_ harus lebih besar dari _param1_ tahun",
        "es": "El _attribute_ debe ser mayor que _param1_ años",
        "hi": "_attribute_ _param1_ साल से अधिक होना चाहिए",
        "ru": "Значение _attribute_ должно быть больше чем _param1_ лет",
        "pt": "O _attribute_ deve ser maior que _param1_ anos",
        "zh": "_attribute_ 必须大于 _param1_ 岁",
        "ja": "_attribute_は_param1_歳よりも大きくなければなりません"
    },
    age_gte: {
        "en": "The _attribute_ must be greater than or equal to _param1_ years",
        "id": "_attribute_ harus lebih besar atau sama dengan _param1_ tahun",
        "es": "El _attribute_ debe ser mayor o igual que _param1_ años",
        "hi": "_attribute_ _param1_ साल से अधिक या उससे बराबर होना चाहिए",
        "ru": "Значение _attribute_ должно быть больше или равно _param1_ годам",
        "pt": "O _attribute_ deve ser maior ou igual a _param1_ anos",
        "zh": "_attribute_ 必须大于等于 _param1_ 岁",
        "ja": "_attribute_は_param1_歳以上でなければなりません"
    }

})
export default langValidation