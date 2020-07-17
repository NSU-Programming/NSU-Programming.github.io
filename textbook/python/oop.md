---
title: ООП в python
menu: textbook-python
---

Язык python содержит средства для объектно-ориентированной разработки. Минимальный класс в python можно создать следующим образом:

```py
class NewGreatType:
    pass

obj = NewGreatType()
type(obj)  # <class '__main__.NewGreatType'>
```

Любой объект в python является объектом класса:

```py
type(1)              # <class 'int'>
type(int)            # <class 'type'>
type(NewGreatType)   # <class 'type'>
type(type)           # <class 'type'>
```

Эти примеры показывают, что типы данных сами являются объектами класса `type`. Встроенная функция `dir` позволяет получить все атрибуты (поля и методы) объекта. Выведем для примера атрибуты объекта `False` класса `bool`:

```py
dir(False)
# ['__abs__', '__add__', '__and__', '__bool__', '__ceil__', '__class__', '__delattr__', '__dir__', '__divmod__', '__doc__', '__eq__', '__float__', '__floor__', '__floordiv__', '__format__', '__ge__', '__getattribute__', '__getnewargs__', '__gt__', '__hash__', '__index__', '__init__', '__init_subclass__', '__int__', '__invert__', '__le__', '__lshift__', '__lt__', '__mod__', '__mul__', '__ne__', '__neg__', '__new__', '__or__', '__pos__', '__pow__', '__radd__', '__rand__', '__rdivmod__', '__reduce__', '__reduce_ex__', '__repr__', '__rfloordiv__', '__rlshift__', '__rmod__', '__rmul__', '__ror__', '__round__', '__rpow__', '__rrshift__', '__rshift__', '__rsub__', '__rtruediv__', '__rxor__', '__setattr__', '__sizeof__', '__str__', '__sub__', '__subclasshook__', '__truediv__', '__trunc__', '__xor__', 'as_integer_ratio', 'bit_length', 'conjugate', 'denominator', 'from_bytes', 'imag', 'numerator', 'real', 'to_bytes']
```

Довольно много для такого простого объекта. Попробуем вызвать метод `__or__`:

```py
False.__or__(False)  # False
False.__or__(True)   # True
```

Вызов этого метода эквивалентен использованию оператора `or`. Мы обнаружили способ перегрузки операторов в python. Она выполняется с помощью определения "магических" методов, некоторые из которых мы рассмотрим ниже.

## Поля и методы

Вспомним класс `LorentzVector`, который мы создавали в [разделе](../cpp/classes) про классы в C++ и начнем писать его аналог на python:

```py
class LorentzVector:
    """ Релятивистский вектор """

    def __init__(self, t, x):
        """ x: может быть int, float или list """
        self.t = t
        self.x = x

    def r2(self):
        """ Квадрат модуля пространственной компоненты """
        if isinstance(self.x, (int, float)):
            return self.x**2
        return sum(list(map(lambda a: a**2, self.x)))

    def inv(self):
        """ Релятивистский инвариант """
        return self.t**2 - self.r2()
```

Метод `__init__` является конструктором. Объект `self` ссылается на сам объект класса (аналог `this` в C++) и является обязательным первым аргументов всех нестатических методов, включая конструктор. В конструкторе мы определили два поля класса: `self.x` и `self.y`. Также мы определили два метода: `r2` возвращает квадрат пространственной компоненты вектора, и `inv` возвращает релятивистский инвариант, соответствующий вектору.

Все поля и методы класса в python являются публичными. Разделение интерфейса и деталей реализации происходит на уровне соглашения об именах полей и методов: атрибут не является частью интерфейса, то его имя должно начинаеться с двух подчеркиваний, например: `__internal_variable`.

Проверим работу класса `LorentzVector`:

```py
lv1 = LorentzVector(1, 0.5)
lv1.t      # 1
lv1.x      # 0.5
lv1.r2()   # 0.25
lv1.inv()  # 0.75
```

```py
lv2 = LorentzVector(1, [0.3, 0.4, 0.0])
lv2.t      # 1
lv2.x      # [0.3, 0.4, 0.0]
lv2.r2()   # 0.25
lv2.inv()  # 0.75
```

Атрибуты могут определяться не только в конструкторе, но и в любом другом методе класса. Более того, атрибуты можно определять прямо в пользовательском коде:

```py
lv = LorentzVector(1, 0.5)
hasattr(lv, 'mass')  # False
lv.mass = 0.3
hasattr(lv, 'mass')  # True
```

Атрибуты класса (статические атрибуты) определяются сразу после названия класса:

```py
class LorentzVector:
    """ Релятивистский вектор """
    speed_of_light = 2.99792458e10  # см / с
    # ...

LorentzVector.speed_of_light  # 29979245800.0
```

Для задания статического метода необходимо использовать декоратор `staticmethod`:

```py
class LorentzVector:
    # ...
    @staticmethod
    def boost_vector(lv):
        """ Возвращает boost-вектор для данного вектора """
        if isinstance(lv.x, (int, float)):
            return lv.x / lv.t
        return list(map(lambda x: x / lv.t, lv.x))
```

Как и следовало ожидать, статический метод не должен иметь аргумент `self`. [Дектораторы](https://habr.com/ru/post/141411/) - это инструмент python, позволяющий менять поведение функций. По сути это функция, которая принимает на вход некоторую функцию, и возвращает новую функцию с тем же набором аргументов.

С помощью декторатора `attribute` можно делать вызов методов, не имеющих аргументов, похожим на обращение к полю класса:

```py
class LorentzVector:
    # ...
    @attribute
    def r2(self):
        """ Квадрат модуля пространственной компоненты """
        if isinstance(self.x, (int, float)):
            return self.x**2
        return sum(list(map(lambda a: a**2, self.x)))

    @attribute
    def inv(self):
        """ Релятивистский инвариант """
        return self.t**2 - self.r2()
```

```py
lv1 = LorentzVector(1, 0.5)
lv1.t    # 1
lv1.x    # 0.5
lv1.r2   # 0.25
lv1.inv  # 0.75
```


## Магические методы



## Наследование


## Полиморфизм в python


## Заключение


## Источники

* [https://docs.python.org/3/reference/datamodel.html](https://docs.python.org/3/reference/datamodel.html)
* [https://docs.python.org/3/tutorial/classes.html](https://docs.python.org/3/tutorial/classes.html)
* [Понимаем декораторы в Python'e, шаг за шагом](https://habr.com/ru/post/141411/)