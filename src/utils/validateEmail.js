const validateEmail = (email) => {
    if (typeof (email) !== 'string') return false;
    const atIndex = email.indexOf('@');
    const dotIndex = email.lastIndexOf('.');

    if (atIndex <= 0 || dotIndex <= atIndex || dotIndex === email.length - 1) {
      return false;
    }
    
    return true;
  };

  module.exports = validateEmail;
