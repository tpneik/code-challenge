var sum_to_n_a = function(n) {
    for (var sum = 0, i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

var sum_to_n_b = function(n) {
    return (
        n == 0 ? 0 : n + sum_to_n_b(n-1)
    );
};

var sum_to_n_c = function(n) {
    return (
        ( n + 1 ) * n / 2)
};

const n = 110;
console.log(sum_to_n_a(n));
console.log(sum_to_n_b(n));
console.log(sum_to_n_c(n));