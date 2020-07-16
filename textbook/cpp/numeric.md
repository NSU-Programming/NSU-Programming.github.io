---
title: Библиотеки numeric и random
menu: textbook-cpp
---

В этой части мы обсудим инструменты стандартной библиотеки C++, которые могут оказаться полезными при разработке численных алгоритмов:

* библиотека `<numeric>` содержит коллекцию численных алгоритмов
* библиотека `<random>` содержит инструменты для генерации случайных чисел
* библиотека `<numbers>` содержит набор констант (включено в стандарт 2020 года)
* библиотека `<complex>` для работы с комплексными числами

## Библиотека numeric

Начнем с простого. Функции `gcd` и `lcm` позволяют найти наибольший общий делитель и наименьшее общее кратное, соответственно:

```cpp
#include <iostream>
#include <numeric>

using namespace std;

int main() {
    int a = 18;
    int b = 2442;
    cout << gcd(a, b) << ' ' << lcm(a, b) << endl;

    return 0;
}
```

Алгоритм `accumulate` позволяет вычислить сумму элементов контейнера:

```cpp
vector<int> v{1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
int sum = accumulate(v.begin(), v.end(), 0);  // sum = 55
```

Третьим аргументом мы передали начальное значение, к которому добавляются значения элементов. Поведение алгоритма `accumulate` можно изменить, задав бинарную функцию, которая должна использоваться вместо оператора `+`. Так, например, можно посчитать факториал:

```cpp
#include <iostream>
#include <numeric>
#include <vector>
#include <functional>  // std::multiplies

using namespace std;

int main() {
    int n = 9;
    vector<int> v(n);
    iota(v.begin(), v.end(), 1);
    int nfact = accumulate(v.begin(), v.end(), 1, multiplies<int>());
    cout << n << "! = " << nfact << endl;  // 9! = 362880

    return 0;
}
```

Заголовочный файл `<functional>` содержит инструменты [функционального программирования](https://ru.wikipedia.org/wiki/%D0%A4%D1%83%D0%BD%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D0%B0%D0%BB%D1%8C%D0%BD%D0%BE%D0%B5_%D0%BF%D1%80%D0%BE%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B5). Вы можете узнать детали в [документации](https://en.cppreference.com/w/cpp/header/functional).

Алгоритм `inner_product` позволяет выполнить скалярное произведение двух векторов. Приведем пример из документации:

```cpp
#include <numeric>
#include <iostream>
#include <vector>
#include <functional>  // std::plus, std::equal_to

using namespace std;

int main() {
    vector<int> a{0, 1, 2, 3, 4};
    vector<int> b{5, 4, 2, 3, 1};

    int r1 = inner_product(a.begin(), a.end(), b.begin(), 0);
    cout << "Inner product of a and b: " << r1 << '\n';

    int r2 = inner_product(a.begin(), a.end(), b.begin(), 0, plus<>(), equal_to<>());
    cout << "Number of pairwise matches between a and b: " <<  r2 << '\n';
}
```

Второе использование `inner_product` в этом примере показывает, что можно переопределять две операции, которые необходимы для выполнения этого алгоритма. Такая гибкость превращает `inner_product` в достаточно универсальный инструмент.

В качестве последнего примера рассмотрим алгоритм `partial_sum`, который вычисляет частичные суммы для некоторого диапазона значений (пример снова взят из документации):

```cpp
#include <numeric>
#include <vector>
#include <iostream>
#include <iterator>  // std::ostream_iterator
#include <functional>  // std::multiplies
#include <algorithm>  // std::copy

using namespace std;

int main() {
    vector<int> v(10, 2); // [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]

    cout << "The first 10 even numbers are: ";
    partial_sum(v.begin(), v.end(), ostream_iterator<int>(cout, " "));
    // The first 10 even numbers are: 2 4 6 8 10 12 14 16 18 20
    cout << '\n';

    partial_sum(v.begin(), v.end(), v.begin(), multiplies<int>());
    cout << "The first 10 powers of 2 are: ";
    copy(v.begin(), v.end(), ostream_iterator<int>(cout, " "));
    // The first 10 powers of 2 are: 2 4 8 16 32 64 128 256 512 1024
    cout << '\n';
}
```

Вас уже не должно удивлять, что во втором случае мы приделали операцию умножения и вычислили степени двойки.

## Генерация псевдослучайных чисел

Случайные числа используются по многих областях вычислений. В частности, широко распространённые алгоритмы [моделирования Монте-Карло](https://ru.wikipedia.org/wiki/%D0%9C%D0%B5%D1%82%D0%BE%D0%B4_%D0%9C%D0%BE%D0%BD%D1%82%D0%B5-%D0%9A%D0%B0%D1%80%D0%BB%D0%BE) полностью полагаются на использование случайных чисел. Генераторы (псевдо)случайных чисел различаются по качеству. Характеристикой качества генератора является период — максимальная длина случайной последовательности, которую он способен сгенерировать. Для большинства практических задач случайные числа достаточно хорошего качества могут быть получены с помощью генератора [Вихрь Мерсенна](https://ru.wikipedia.org/wiki/%D0%92%D0%B8%D1%85%D1%80%D1%8C_%D0%9C%D0%B5%D1%80%D1%81%D0%B5%D0%BD%D0%BD%D0%B0), период которого приблизительно равен `4.3e6001` (6001 знаков). Этот генератор доступен в стандартной библиотеке C++ и подключается с помощью заголовочного файла `<random>`. Покажем, как можно генерировать равномерные распределения для целых и дробных чисел с помощью этого генератора:

```cpp
#include <random>
#include <iostream>
#include <algorithm>
#include <iterator>

using namespace std;

int main() {
    random_device rd;  // Will be used to obtain a seed for the random number engine
    mt19937 gen(rd()); // Standard mersenne_twister_engine seeded with rd()
    uniform_int_distribution<> distrib(1, 6);

    vector<int> v;
    generate_n(back_inserter(v), 10, [&distrib, &gen]{return distrib(gen);});
    copy(v.begin(), v.end(), ostream_iterator<int>(cout, " "));
}
```

Объект типа `std::random_device` позволяет получить случайное целое число, которое мы использовали для выбора последовательности основного генератора `mt19937`, реализующего Вихрь Мерсеенна. После инициализации генератора мы создаём объект типа `std::uniform_int_distribution`, который позволяет генерировать равномерное целочисленное распределение. Параметры `1` и `6` задают минимальное и максимальное значения диапазона нашей случайной величины. Для заполнения вектора случайными значениями мы воспользовались алгоритмом `generate_n` и лямбда-выражением. Внутри лямбда-выражения нам необходим доступ к объектам `distrib` и `gen`, поэтому мы поместили в квадратные скобки ссылки на эти объекты.

Равномерное распределение для действительных чисел получается схожим образом: вместо `uniform_int_distribution` необходимо использовать `uniform_real_distribution`. Полный список доступных распределений можно найти в [документации](https://en.cppreference.com/w/cpp/header/random). Этот список включает

* Распределение Бернулли `bernoulli_distribution`
* Биномиальное распределение `binomial_distribution`
* Распределение Пуассона `poisson_distribution`
* Экспоненциальное распределение `exponential_distribution`
* Гамма-распределение `gamma_distribution`
* Нормальное распределение `normal_distribution`
* Распределение хи-квардат `chi_squared_distribution`
* f-распределение Фишера `fisher_f_distribution`
* t-распределение Стьюдента `student_t_distribution`

## Библиотека numbers

Эта простая библиотека, включённая в стандарт C++ в 2020 году, содержит часто используемые константы, находящиеся в пространстве имен `std::numbers`, в частности:

* Число Эйлера `e_v`
* Число пи `pi_v`
* Квадрантный корень из двух `sqrt2_v`
* Квадрантный корень из трех `sqrt3_v`

[и другие](https://en.cppreference.com/w/cpp/numeric/constants).

## Комплексные числа в C++

Заголовочный файл `<complex>` содержит инструменты для работы с комплексными числами. Следующие примеры иллюстрируют работу с комплексными числами:

```cpp
#include <iostream>
#include <complex>
#include <cmath>
#include <numbers>  // pi_v

using namespace std;
using namespace std::numbers;

int main() {
    complex<double> c1(cos(0.25*pi_v), sin(0.25*pi_v));  // e^(i*pi/4)
    complex<double> c2 = cos(0.25*pi_v) + 1i*sin(0.25*pi_v);  // e^(i*pi/4)
    complex<double> c3 = exp(1i*0.25*pi_v);  // e^(i*pi/4)
    complex<double> c4 = polar(1., 0.25*pi_v);  // e^(i*pi/4)

    cout << (c1 == c2) << ", " << (c2 == c3) << ", " << (c3 == c4) << endl;
    // true, true, true

    cout << c1 << endl;  // вывод в стандартный поток
    double re = c1.real();  // реальная часть
    double im = c1.imag();  // мнимая часть
    double absval = abs(c2);  // модуль
    complex<double> cpow = pow(2, c3);  // 2 в степени e^(i*pi/4)
    complex<double> ccos = cos(c4);  // косинус числа e^(i*pi/4)

    return 0;
}
```

## Резюме

В этой части мы обсудили математические инструменты стандарта C++: численные алгоритмы, генераторы случайных чисел, набор констант, тип комплексных чисел. Эти инструменты значительно облегчают разработку программ, выполняющих вычисления, например, программ для моделирования физических систем.

## Документация

* [https://en.cppreference.com/w/cpp/numeric](https://en.cppreference.com/w/cpp/numeric)
* [https://en.cppreference.com/w/cpp/header/random](https://en.cppreference.com/w/cpp/header/random)
* [https://en.cppreference.com/w/cpp/header/functional](https://en.cppreference.com/w/cpp/header/functional)
* [https://en.cppreference.com/w/cpp/numeric/constants](https://en.cppreference.com/w/cpp/numeric/constants)
