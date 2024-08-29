exports.censorWord = (str) => {
    const repeatLength = str.length >= 5 ? 3 : str.length - 2;
    return str.slice(0, 3) + '*'.repeat(repeatLength) + str.slice(-1);
};

exports.censorWalletAddress = (str) => {
    const repeatLength = 8;
    return str.slice(0, 6) + '*'.repeat(repeatLength) + str.slice(-6);
};

const censorWordForEmail = (str) => {
    const repeatLength = str.length >= 5 ? 3 : str.length - 2;
    return str[0] + '*'.repeat(repeatLength) + str.slice(-1);
};

exports.censorEmail = (email) => {
    if (!email) return '';
    const arr = email.split('@');
    return `${censorWordForEmail(arr[0])}@${censorWordForEmail(arr[1])}`;
};