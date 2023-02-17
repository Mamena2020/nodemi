/**
 * Default error message
 */
const langValidation = Object.freeze({
    required: {
        en: "The _attribute_ is required",
        id: "_attribute_ wajib di isi"
    },
    email: {
        en: "The _attribute_ must in E-mail format",
        id: "_attribute_ harus dalam format E-mail",
    },
    match: {
        en: "The _attribute_ must be match with _param1_",
        id: "_attribute_ harus sama dengan _param1_"
    },
    string: {
        en: "The _attribute_ must be in string format",
        id: "_attribute_ harus dalam format string"
    },
    float: {
        en: "The _attribute_ must be numeric",
        id: "_attribute_ harus dalam format angka"
    },
    integer: {
        en: "The _attribute_ must be integer",
        id: "_attribute_ harus bilangan bulat"
    },
    max: {
        en: "The _attribute_ should be less or equal then _param1_",
        id: "_attribute_ harus kurang atau sama dengan _param1_"
    },
    min: {
        en: "The _attribute_ should be more or equal then _param1_",
        id: "_attribute_ harus lebih atau sama dengan _param1_"
    },
    date: {
        en: "The _attribute_ must be in date format",
        id: "_attribute_ harus dalam format tanggal"
    },
    array: {
        en: "The _attribute_ must be in array format",
        id: "_attribute_ harus dalam format array"
    },
    exists: {
        en: "The _attribute_ not recorded in database",
        id: "_attribute_ tidak terdaftar di database"
    },
    unique: {
        en: "The _attribute_ already used",
        id: "_attribute_ sudah digunakan"
    },
    mimetypes: {
        en: "The _attribute_ must be in file format of _param1_",
        id: "_attribute_ harus dalam format file dari _param1_"
    },
    mimes: {
        en: "The _attribute_ must be in have extention of _param1_",
        id: "_attribute_ harus memiliki extention _param1_"
    },
    max_file: {
        en: "The _attribute_ should have file size less or equal then _param1_ _param2_",
        id: "_attribute_ harus memiliki ukuran file kurang atau sama dengan _param1_ _param2_"
    },
    image: {
        en: "The _attribute_ should be image format",
        id: "_attribute_ harus dalam format gambar"
    },
    date_after: {
        en: "The _attribute_ date must be after _param1_'s date",
        id: "_attribute_ harus setelah tanggal _param1_"
    },
    date_after_or_equal: {
        en: "The _attribute_ date must be after or equal than _param1_'s date",
        id: "_attribute_ harus setelah atau sama dengan tanggal _param1_"
    },
    date_before: {
        en: "The _attribute_ date must be before _param1_'s date",
        id: "_attribute_ harus sebelum tanggal _param1_"
    },
    date_before_or_equal: {
        en: "The _attribute_ date must be before or equal than _param1_'s date",
        id: "_attribute_ harus sebelum atau sama dengan tanggal _param1_"
    },
    bolean: {
        en: "The _attribute_ must be have true or false format",
        id: "_attribute_ harus dalam format benar atau salah"
    },
    in_array: {
        en: "The _attribute_ selected field is invalid",
        id: "_attribute_ terpilih tidak valid"
    },
    not_in_array: {
        en: "The _attribute_ selected field is invalid",
        id: "_attribute_ terpilih tidak valid"
    },
    ip: {
        en: "The _attribute_ must an Ip address",
        id: "_attribute_ harus dalam format Ip address"
    },
    url: {
        en: "The _attribute_ must an Url",
        id: "_attribute_ harus berupa Url"
    },
    json: {
        en: "The _attribute_ must be an Json format",
        id: "_attribute_ harus berupa format Json"
    },
    digits: {
        en: "The _attribute_ must be _param1_ digits",
        id: "_attribute_ harus _param1_ digit"
    },
    max_digits: {
        en: "The _attribute_ must be less or equal than _param1_ digits",
        id: "_attribute_ harus kurang atau sama dengan _param1_ digit"
    },
    min_digits: {
        en: "The _attribute_ must be more or equal than _param1_ digits",
        id: "_attribute_ harus lebih atau sama dengan _param1_ digit"
    },
    digits_between: {
        en: "The _attribute_ must be between _param1_ and _param2_ digits",
        id: "_attribute_ harus diantara _param1_ dan _param2_ digit"
    }
})

export default langValidation