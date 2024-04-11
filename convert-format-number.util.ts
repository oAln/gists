export function convertFormattedNumber(num, locale = 'en-US') {
    if (num) {
      const { format } = new Intl.NumberFormat(locale);
      const [, decimal] = /^0(.)1$/.exec(format(0.1));
      const number = +num
        .toString()
        .replace(new RegExp(`[^${decimal}\\d]`, 'g'), '')
        .replace(decimal, '.');
      const formatNum = Math.round((number + Number.EPSILON) * 100) / 100;
      return formatNum;
    } else {
      return 0;
    }
  }