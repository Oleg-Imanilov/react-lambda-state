function PVIF(rate, nper) {
    return Math.pow(1 + rate, nper);
};

function FVIFA(rate, nper) {
    return rate === 0 ? nper : (PVIF(rate, nper) - 1) / rate;
};

function PMT(rate, nper, present_value, future_value = 0, type = 0) {
    if (rate === 0) return -(present_value + future_value) / nper;

    var pvif = Math.pow(1 + rate, nper);
    var pmt = (rate / (pvif - 1)) * -(present_value * pvif + future_value);

    if (type === 1) {
        pmt /= 1 + rate;
    }

    return pmt;
};

function IPMT(present_value, pmt, rate, per) {
    var tmp = Math.pow(1 + rate, per);
    return 0 - (present_value * tmp * rate + pmt * (tmp - 1));
};

function PPMT(rate, per, nper, present_value, future_value, type) {
    if (per < 1 || per >= nper + 1) return null;
    var pmt = PMT(rate, nper, present_value, future_value, type);
    var ipmt = IPMT(present_value, pmt, rate, per - 1);
    return pmt - ipmt;
};

function DaysBetween(date1, date2) {
    var oneDay = 24 * 60 * 60 * 1000;
    return Math.round(Math.abs((date1.getTime() - date2.getTime()) / oneDay));
};

// Change Date and Flow to date and value fields you use
// values: {Date:number, Flow:number}[]
function XNPV(rate, values) {
    var xnpv = 0.0;
    var firstDate = new Date(values[0].Date);
    for (var key in values) {
        var tmp = values[key];
        var value = tmp.Flow;
        var date = new Date(tmp.Date);
        xnpv += value / Math.pow(1 + rate, DaysBetween(firstDate, date) / 365);
    }
    return xnpv;
};

// values: {Date:number, Flow:number}[]
function XIRR(values, guess) {
    if (!guess) guess = 0.1;

    var x1 = 0.0;
    var x2 = guess;
    var f1 = XNPV(x1, values);
    var f2 = XNPV(x2, values);

    for (var i = 0; i < 100; i++) {
        if (f1 * f2 < 0.0) break;
        if (Math.abs(f1) < Math.abs(f2)) {
            f1 = XNPV((x1 += 1.6 * (x1 - x2)), values);
        } else {
            f2 = XNPV((x2 += 1.6 * (x2 - x1)), values);
        }
    }

    if (f1 * f2 > 0.0) return null;

    var f = XNPV(x1, values);
    let rtb, dx;
    if (f < 0.0) {
        rtb = x1;
        dx = x2 - x1;
    } else {
        rtb = x2;
        dx = x1 - x2;
    }

    for (let i = 0; i < 100; i++) {
        dx *= 0.5;
        var x_mid = rtb + dx;
        var f_mid = XNPV(x_mid, values);
        if (f_mid <= 0.0) rtb = x_mid;
        if (Math.abs(f_mid) < 1.0e-6 || Math.abs(dx) < 1.0e-6) return x_mid;
    }

    return null;
};



function range (start, end) {
    const ret = []
    for(let i=start;i<end;i++) {
        ret.push(i)
    }
    return ret
}

function foreach (arr, f) {
    return arr.map(f)
}

function reduce(arr, f) {
    return arr.reduce(f, 0)
}

export default {
    range,
    foreach,
    reduce,
    PVIF,
    FVIFA,
    PMT,
    IPMT,
    PPMT,
    DaysBetween,
    XNPV,
    XIRR,
}
