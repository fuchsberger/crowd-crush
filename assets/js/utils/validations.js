export default {
  EMAIL: {
    email: true,
    required: { value: true, errorMessage: "Required." }
  },
  PASSWORD: {
    required: { value: true, errorMessage: "Required." },
    minLength: { value: 6, errorMessage: "Must contain at least 6 characters." }
  },
  OPTIONS: {
    format: 'custom',
    fullMessages: false
  },
  VIDEO_TITLE: {
    presence: { allowEmpty: false },
    length: { minimum: 5, maximum: 100 }
  },
  VIDEO_DESC: {
    presence: { allowEmpty: false }
  }
}

// export function isValid(error) {
//   return error ? false : error === false ? true : null;
// }

// export function validation_fb_one_or_false(errors) {
//   let result = {};
//   for (var i = 0; i < errors.length; i++) {
//     const key = errors[i].attribute;
//     if (!(key in result)) result[errors[i].attribute] = errors[i].error;
//   }
//   return result;
// }
