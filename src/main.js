var operators = {
    "+": function (a, b) {
        return (a + b);
    },
    "-": function (a, b) {
        return (a - b);
    },
    "*": function (a, b) {
        return (a * b);
    },
    "/": function (a, b) {
        if (b != 0)
            return (a / b);
        console.log("Zero dividing.");
        return (NaN);
    },
    "%": function (a, b) {
        return (a % b);
    }
};

function isNbr(nb) {
    var isNbr = new RegExp(/^[0-9.]+$/);
    if (isNbr.test(nb))
        return (true);
    return (false);
}

function Arbre_Bin(val, fd = null, fg = null) {
    this.val = noPar(val);
    this.fd = fd;
    this.fg = fg;

    this.eval = function() {
        if (isNbr(this.val))
            return (parseInt(this.val));
        else {
            console.log(this.val);
            var val_g = this.fg == null ? 0 : this.fg.eval();
            var val_d = this.fd == null ? 0 : this.fd.eval();
            return (operators[this.val](val_g, val_d));
        }
    };

    this.str = function () {
        var res = "";
        res += this.val + "("
        if (this.fg != null)
            res += this.fg.str();
        res += ") (";
        if (this.fd != null)
            res += this.fd.str();
        res += ")";
        return (res);
    };
}

function noPar(str) {
    var result = "";
    for (var i = 0, len = str.length; i < len; i++) {
        if (str[i] != "(" && str[i] != ")")
            result += str[i];
    }
    return (result);
}

function create_simple_tree(elems) {
    if (elems.length == 1) {
        if (elems[0] instanceof Arbre_Bin)
            return (elems[0]);
        return (new Arbre_Bin(elems[0]));
    }
    var res;
    
    for (var i = 0; i < elems.length - 1; i++) {
        if (elems[i] == "+" || elems[i] == "-") {
            res = new Arbre_Bin(elems[i]);
            res.fg = create_simple_tree(elems.slice(0, i));
            res.fd = create_simple_tree(elems.slice(i + 1, elems.length));
            return (res);
        }
    }

    for (var i = 0; i < elems.length - 1; i++) {
        if (elems[i] == "*" || elems[i] == "/") {
            res = new Arbre_Bin(elems[i]);
            res.fg = create_simple_tree(elems.slice(0, i));
            res.fd = create_simple_tree(elems.slice(i + 1, elems.length));
            return (res);
        }
    }
    return (new Arbre_Bin(0));
}

function elems_str_debug(list) {
    var res = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] instanceof Arbre_Bin)
            res.push(list[i].str());
        else
            res.push(list[i]);
    }
    return (res);
}

function par_to_tree(elems) {
    var maxPar, minPar, current_tree, i;
    var change = true;
    console.log(elems);
    while (change) {
        change = false;
        i = 0;
        while (i < elems.length && elems[i] != ")")
            i++;
        if (elems[i] == ")") {
            maxPar = i;
            minPar = maxPar;
            change = true;
            while (elems[minPar] != "(")
                minPar--;
            current_tree = create_simple_tree(elems.slice(minPar + 1, maxPar));
            elems.splice(minPar, maxPar - minPar + 1, current_tree);
            console.log("ETAPE " + i + "============");
            console.log(elems_str_debug(elems));
        }
    }
    return (elems);
}

function clean_list(list) {
    var res = [];
    var possible = "+-*/%()";
    for (var i = 0; i < list.length; i++) {
        if (list[i] != "" && (isNbr(list[i]) || possible.indexOf(list[i]) != -1))
            res.push(list[i]);
    }
    return (res);
}

function my_eval(str) {
    var elems = str.split(/(\+|-|\*|\/|%|\)|\()/);
    elems = clean_list(elems);
    var arbre = par_to_tree(elems);
    arbre = create_simple_tree(arbre);
    return (arbre);
    //arbre = create_tree(par_to_tree(elems));
    //return (arbre.eval());
}

var calc = "9*((6+3*(2-3))*7)+4*(24-16)";
var arbre = my_eval(calc);
console.log("Result: " + arbre.eval())
console.log(arbre.str());
/*
 *
 *              *
 *          9       +
 *              6       -
 *                  *       3
 *              3       2
 *          9 * (6 + (3 * 2) - 3)
 *          
 *
 */
