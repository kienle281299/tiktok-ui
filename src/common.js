export function truncateAddress(str, n = 15) {
    let string = str.substring(n + 2, 42 - n);
    return str.replace(string, '...');
}

export function isAddress(address) {
    var re = /^0x[a-fA-F0-9]{40}$/;
    return re.test(address);
}
