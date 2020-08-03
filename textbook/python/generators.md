---
title: Итераторы и генераторы
menu: textbook-python
---

## Итераторы

В предыдущих разделах мы встречали различные итерируемые объекты. Такие объекты можно использовать в цикле `for`, к ним можно применять оператор `in`. Разберемся в механизме итерирования. Классы стандартных контейнеров имеют метод `__iter__`, возвращающий итератор:

```py
l = [1, 2, 3]
s = set(1, 2, 3)
d = {k: v for v, k in enumerate(['a', 'b', 'c'])}

all(map(lambda x: hasattr(x, '__iter__'), [l, s, d]))  # True
type(l.__iter__())  # <class 'list_iterator'>
type(iter(l))       # <class 'list_iterator'>

itl = iter(l)
for x in itl:
    print(x, end=' ')
# 1 2 3

for x in itl:
    print(x, end=' ')
# этот цикл не запустится, поскольку итератор позволяет
# перебрать объекты только один раз

its = iter(s)
type(its)  # <class 'set_iterator'>
# для получения следующего значения можно использовать функцию next.
# Функция next вызывается при переборе значений в цикле for
next(its)  # 1
next(its)  # 2
next(its)  # 3
```

Вызов метода `__iter__` в данном случае аналогичен использованию функции [`iter`](https://docs.python.org/3/library/functions.html#iter). В обоих случаях мы получаем [итератор](https://docs.python.org/3/glossary.html#term-iterator). В итераторе должен быть определен метод `__next__`, который возвращает следующее значение. Функция [`next`](https://docs.python.org/3/library/functions.html#next) вызывает метод `__next__`.

Функция `iter` также вернет итератор, если вместо метода `__iter__` реализован метод `__getitem__`, позволяющий доступаться к элементам контейнера по индексу.

Чтобы сделать тип итерируемым, достаточно реализовать метод `__iter__` или метод `__getitem__`. Чтобы создать тип-итератор, необходимо определить в нем метод `__next__` и метод `__iter__`. Последний должен возвращать сам объект (`self`). Таким образом, итераторы сами являются итерируемыми объектами.

## Генераторы

Другой встречавшийся нам итерируемый объект - результат вызова функции [`range`](https://docs.python.org/3/library/functions.html#func-range):

```py
import sys

for x in range(5):
    print(x, end=' ')
# 1 2 3 4 5

rng = range(10**6)
type(rng)  # <class 'range'>
sys.getsizeof(rng)  # 48 - размер объекта в байтах

l = list(rng)
sys.getsizeof(l)  # 9000120
```

Функция `range` возвращает объект типа [`range`](https://docs.python.org/3/library/stdtypes.html#typesseq-range), который занимает фиксированный объем памяти. Эффективное использование памяти достигается благодаря тому, что каждое значение вычисляется в реальном времени, позволяя избавиться от необходимости хранить все значения в памяти. Такое поведение можно реализовать с помощью [генераторов](https://wiki.python.org/moin/Generators). Напишем свою версию `range`:

```py
def my_range(start, stop=None, step=None):
    if step is None:
        step = 1
    if stop is None:
        start, stop = 0, start
    v = start
    while v < stop:
        yield v
        v += step

myrng = my_range(5)
type(myrng)           # <class 'generator'>
sys.getsizeof(myrng)  # 128

for x in myrng:
    print(x, end=' ')
# 0 1 2 3 4
```

Размер нашего генератора больше, чем объекта `range`, но он также не зависит от значений аргументов функции `my_range`. Ключевым элементом функции-генератора `my_range` является строка

```py
yield v
```

При достижении этой строки генератор запоминает свое состояние, прерывает работу до следующего вызова метода `__next__` и возвращает текущее значение переменной `v`.

Создадим более интересный генератор, который вычисляет [последовательность Рекамана](https://en.wikipedia.org/wiki/Recam%C3%A1n%27s_sequence):

```py
def rekaman(stop):
    n = 0
    prev = 0
    visited = set()
    while n < stop:
        if n == 0:
            yield 0
            prev = 0
        elif prev - n > 0 and prev - n not in visited:
            yield prev - n
            prev = prev - n
        else:
            yield prev + n
            prev = prev + n
        n += 1
        visited.add(prev)

for r in rekaman(100):
    print(r, end=' ')
# 0 1 3 6 2 7 13 20 12 21 11 22 10 23 9 24 8 25 43 62 42 63 41 18 42
# 17 43 16 44 15 45 14 46 79 113 78 114 77 39 78 38 79 37 80 36 81 35
# 82 34 83 33 84 32 85 31 86 30 87 29 88 28 89 27 90 26 91 157 224
# 156 225 155 226 154 227 153 228 152 75 153 74 154 73 155 72 156 71
# 157 70 158 69 159 68 160 67 161 66 162 65 163 64
```

Функции-генераторы являются удобным и гибким инструментом языка python. Иметь этот инструмент в арсенале очень полезно.

Альтернативный способ создания генераторов предоставляют [генераторные выражения](https://www.python.org/dev/peps/pep-0289/):

```py
l1 = [x**2 for x in range(100)]  # списковое включение
g1 = (x**2 for x in range(100))  # генераторное выражение

type(l1)  # <class 'list'>
type(g1)  # <class 'generator'>
```

Генераторные выражения имеют синтаксис близкий к списковому включению. Отличие состоит только в использовании круглых скобок. В частности, в генераторных выражениях можно использовать условный оператор:

```py
g = (x for x in range(20) if x % 3)
for val in g:
    print(val, end=' ')
# 1 2 4 5 7 8 10 11 13 14 16 17 19
```

Если необходима более сложная логика, то следует вернуться к использованию функций-генераторов.

Функция `map` также возвращает итератор (генератор):

```py
l1 = [x**2 for x in range(100)]
g1 = (x**2 for x in range(100))
m1 = map(lambda x: x**2, range(100))

type(l1)  # <class 'list'>
type(g1)  # <class 'generator'>
type(m1)  # <class 'map'>

sys.getsizeof(l1)  # 920
sys.getsizeof(g1)  # 128
sys.getsizeof(m1)  # 64
```

Если преобразованную коллекцию необходимо обходить несколько раз или надо сохранить все её элементы, то генератор можно преобразовать в список:

```py
m2 = list(map(lambda x: x**2, range(100)))
```

С помощью генераторов удобно создавать итераторы. Вернемся к примеру из [одного из предыдущих разделов](oop.md), в котором мы реализовали класс релятивистских векторов:

```py
from typing import NamedTuple

class FourVector(NamedTuple):
    t: float
    r: list

fv = FourVector(1, [0.3, 0.4, 0.0])
for x in fv:
    print(x, end=' ')
# 1 [0.3, 0.4, 0.0]
```

Объекты класса `FourVector` является итерируемыми, поскольку класс наследуется от типа `NamedTuple`. Давайте изменим правило итерирования:

```py
import itertools

class FourVector(NamedTuple):
    t: float
    r: list

    def __iter__(self):
        if isinstance(self.r, list):
            return itertools.chain([self.t], self.r)
        return (x for x in [self.t, self.r])

fv1 = FourVector(1, [0.3, 0.4, 0.0])
fv2 = FourVector(1, 0.5)

for x in fv1:
    print(x, end=' ')
# 1 0.3 0.4 0.0

for x in fv2:
    print(x, end=' ')
# 1 0.5
```

Мы не могли использовать спиское включение вместо генераторного выражения в методе `__iter__`, поскольку, в отличие от типа `generator`, тип `list` не является итератором. Функция `itertools.chain` принимает несколько итераторов или итерируемых коллекций и создаёт генератор, который последовательно проходит по всем их элементам.

<!-- Все инструменты модуля [`itertools`](https://docs.python.org/3/library/itertools.html) возвращают итераторы. -->

## Резюме

Итерируемый объект должен иметь реализацию хотя бы одного из методов `__iter__` и `__getitem__`. Объект-итератор должен иметь реализацию метода `__next__`.

Генераторы являются инструментом для вычисления элементов последовательносей "на лету" и позволяют избежать хранения всех элементов последовательности в памяти. Генераторные выражения позволяют создавать генераторы с простой логикой. Генераторы удобно использовать при реализации итераторов.

## Источники

* [The Python Wiki: Generators](https://wiki.python.org/moin/Generators)
* [Как работает yield](https://habr.com/ru/post/132554/)
* [How to make an iterator in Python](https://treyhunner.com/2018/06/how-to-make-an-iterator-in-python/)
* [PEP 289 - Generator Expressions](https://www.python.org/dev/peps/pep-0289/)
* [Сопрограммы в Python](https://habr.com/ru/post/196918/)
