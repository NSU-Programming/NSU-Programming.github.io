---
layout: default
title: Основы синтаксиса языка python
---

# {{ page.title }}

Язык python прост в изучении, хорошо документирован и очень популярен. Ответы на большинство вопросов касающихся python могут быть найдены с помощью поисковых запросов в вашей любимой поисковой системе.

Этот раздел представляет собой набор примеров, которые показывают основные средства языка python.

<!-- В отличие от C++, python является:

* интерпретируемым языком программирования
* языком со строгой динамической типизацией (в C++ - нестрогая статическая) -->

## Основные типы данных

Язык python обладает набором очень мощных встроенных типов данных.

### Арифметические типы

В python есть три арифметических типа: `int`, `float` и `complex`:

```python
a = 4
type(a)  # int
b = 4.
type(b)  # float
c = 5 + 6 * (2**5) / 7  # float 32.42857142857143
d = 5 + 6 * (2**5) // 7  # int 32
e = 2 + 3j
type(e)  # complex
type(e.real)  # float
e.conjugate()  # (2-3j)
```

Тип `int` обладает произвольной точностью:

```python
print(2**256)
# 115792089237316195423570985008687907853269984665640564039457584007913129639936
```

Тип `float` на большинстве платформ имеет размер 64 бита.

### Логический тип и объект None

Логический тип `bool` представлен значениями `True` и `False`. Логические выражение можно составлять с помощью операторов `and`, `or` и `not`:

```python
True or False  # True
2 < 3 and 3 < 5  # True
2 < 3 and not 5 < 3  # True
2 == 2  # True
3 != 2  # True
a = True
a is True  # True
```

В последнем примере использован оператор `is`, который проверяет *идентичность* объектов, т.е. ссылаются ли объекты на одну и ту же область памяти. Оператор `is` не проверяет равенство:

```python
a = 3.1415
b = 3.1415
a == b  # True
a is b  # False
```

Объект `None` обозначает отсутствие значения и может использоваться в логических выражениях:

```python
None == None  # True
None is None  # True
not None  # True
bool(None)  # False
```

### Строки

Строки в python представлены типом `str`

```python
s = 'Hello'
type(s)  # str
```

Длину строки можно получить с помощью встроенной функции `len`

```python
len(s)  # 5
```

Конкатенация строк выполняется с помощью оператора сложения

```python
'Hello, ' + 'world!'
```

## Изменяемые и неизменяемые объекты в python


## Типизация в python



## Документация

* [https://www.tutorialspoint.com/python/python_basic_syntax.htm](https://www.tutorialspoint.com/python/python_basic_syntax.htm)
* [https://www.tutorialspoint.com/python/python_variable_types.htm](https://www.tutorialspoint.com/python/python_variable_types.htm)
* [https://docs.python.org/3/library/functions.html](https://docs.python.org/3/library/functions.html)
* [Как в Python реализованы очень длинные числа типа integer](https://habr.com/ru/company/otus/blog/489258/)
* [https://www.stavros.io/tutorials/python](https://www.stavros.io/tutorials/python/)
* [https://realpython.com/python-data-types](https://realpython.com/python-data-types/)