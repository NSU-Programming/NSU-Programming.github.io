---
title: Стандартные модули II
menu: textbook-python
---

В этом разделе мы продолжаем разговор о модулях стандартной библиотеки python. Формат курса не позволяет обсуждать их в деталях, поэтому в большинстве случаев показаны только простые и наиболее характерные примеры использования различных инструментов.

## Сериализация объектов

[Сериализация](https://en.wikipedia.org/wiki/Serialization) - это процесс перевода объектов в формат, в котором их можно хранить и передавать. Обратный процесс называется десериализацией.

### Текстовое представление

В [разделе про ООП](oop.md) мы обсуждали метод `__repr__`, который возвращает текстовое представления объекта. В комбинации с функцией [`literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval) модуля [`ast`](https://docs.python.org/3/library/ast.html) его можно использовать для сериализации и десериализации объектов python:

```py
import ast

# создаем список объектов различных стандартных типов
data = [
    1, 2, 'a',
    ['2', 1],
    (3, 2, 1),
    {x: y**2 for x, y in enumerate(range(3))}
]

# сохраняем текстовое представление в файл
with open('s1.txt', 'w') as f:
    f.write(repr(data))

# читаем файл и конструируем точную копию исходного объекта
with open('s1.txt', 'r') as f:
    restored_data = ast.literal_eval(f.read())

type(restored_data)     # <class 'list'>
type(restored_data[4])  # <class 'tuple'>
print(restored_data)
# [1, 2, 'a', ['2', 1], (3, 2, 1), {0: 0, 1: 1, 2: 4}]
```

<!-- Объекты при этом хранятся в текстовом формате, что позволяет данные прямо доступны для чтения человеком. -->

### Модуль pickle

Модуль [`pickle`](https://docs.python.org/3/library/pickle.html) содержит инструменты для сериализации стандартных объектов python в последовательность байтов:

```py
# сохраняем бинарное представление в файл
with open('s1.dat', 'wb') as f:
    # используем объект data из предыдущего примера
    pickle.dump(data, f)

# читаем файл и конструируем точную копию исходного объекта
with open('s1.dat', 'rb') as f:
    restored_data = pickle.load(f)

type(restored_data)     # <class 'list'>
type(restored_data[4])  # <class 'tuple'>
print(restored_data)
# [1, 2, 'a', ['2', 1], (3, 2, 1), {0: 0, 1: 1, 2: 4}]
```

Сравним скорость выполнения этого и предыдущего примеров. Запись и чтение данных в текстовом формате занимает около 180 микросекунд, в то время как использование бинарного представления с применением модуля `pickle` требует около 80 микросекунд для аналогичной операции.

### Модуль json

Формат [JSON](https://www.json.org/json-ru.html) (JavaScript Object Notation) очень популярен при передаче данных в сети. Этот формат переводит объекты в текстовое представление, которое не привязано к языку программирования.

Стандартные структуры данных могут быть сериализованы с модулем json следующим образом:

```py
import json

with open('s1.txt', 'w') as f:
    json.dump(data, f)

with open('s1.txt', 'r') as f:
    restored_data = json.load(f)
```

Чтобы определить правила сериализации для нового типа данных, необходимо определить класс-наследник класса [`json.JSONEncoder`](https://docs.python.org/3/library/json.html#json.JSONEncoder). Во многих случаях объекты пользовательских типов могут быть сериализованы через атрибут `__dict__`. Подробное обсуждение сериализации произвольных объектов выходит за рамки этого обзора.

Стандартная библиотека python содержит и другие модули, позволяющие выполнять сериализацию данных, например, [CSV](https://docs.python.org/3/library/csv.html) и [XML](https://docs.python.org/3/library/xml.html). Из нестандартных инструментов упомянем библиотеку [pyyaml](https://pyyaml.org/wiki/PyYAMLDocumentation) и мощную библиотеку [protobuf](https://developers.google.com/protocol-buffers) для сериализации от компании Google.

## Сжатие данных

### Модуль zlib

Модуль [`zlib`](https://docs.python.org/3/library/zlib.html) предоставляет интерфейс к библиотеке [zlib](https://en.wikipedia.org/wiki/Zlib) языка C и содержит инструменты для архивирования и разархивирования последовательности байтов.

Функция [`zlib.compress`](https://docs.python.org/3/library/zlib.html#zlib.compress) принимает последовательность байтов и возвращает объект, содержащий сжатые данные:

```py
import zlib
import sys
import binascii

s = b'Compress me!' * 100
cs = zlib.compress(s, -1)

print(binascii.hexlify(cs))
# b'789c73cecf2d284a2d2e56c84d55741e658fb247d9a3ec41cc06003a6ab52c'

len(s)   # 1200
len(cs)  # 31

sys.getsizeof(s)   # 1233
sys.getsizeof(cs)  # 64
```

Второй параметр функции `zlib.compress` - целое число от -1 до 9 - определяет степень и скорость сжатия. Значение -1 соответствует степени сжатия по умолчанию 6. Чтобы сжать файл, достаточно прочитать его содержимое в бинарной моде и передать в функцию `zlib.compress`.

Функция `zlib.decompress` выполняет обратное преобразование:

```py
zlib.decompress(cs).decode()[:12]
# Compress me!
```

### Модуль zipfile

Модуль [`zipfile`](https://docs.python.org/3/library/zipfile.html) позволяет создавать и читать [zip-архивы](https://en.wikipedia.org/wiki/Zip_(file_format)):

```py
import os
import zipfile

work_dir = './'

fname = os.path.join(work_dir, 'text.txt')
zipname = os.path.join(work_dir, 'text.zip')

# создаем файл, который будем сжимать
with open(fname, 'w') as f:
    f.write('Compress me!'*10000)


# создаем zip-архив
with zipfile.ZipFile(zipname, 'w', zipfile.ZIP_DEFLATED) as zipObj:
    # ZIP_STORED - сжатие отсутствует
    # ZIP_DEFLATED - обычное ZIP-сжатие, использует модуль zlib
    # ZIP_BZIP2 - метод сжатия BZIP2, использует модуль bz2
    # ZIP_LZMA - метод сжатия LZMA, использует модуль lzma
    zipObj.write(fname)

# проверяем, что архив создан и узнаем какой у него размер
os.path.getsize(fname)    # 120000
os.path.getsize(zipname)  # 379

# удалаяем исходный файл
os.remove(fname)
assert not os.path.isfile(fname)

# читаем архив
with zipfile.ZipFile(zipname, 'r') as zipObj:
    zipObj.extractall()

# открываем данные, полученные из архива
with open(fname, 'r') as f:
    s = f.read()

print(s[:12])  # Compress me!
```

### Модуль tarfile

Модуль [`tarfile`](https://docs.python.org/3/library/tarfile.html) позволяет работать с [tar-архивами](https://en.wikipedia.org/wiki/Tar_(computing)):

```py
import os
import tarfile

work_dir = './'

fname = os.path.join(work_dir, 'text.txt')
tarname = os.path.join(work_dir, 'text.tar')

with open(fname, 'w') as f:
    f.write('Compress me!'*10000)

with tarfile.open(tarname, 'w:gz') as targz:
    #    'w|' - сжатие отсутствует
    #  'w:gz' - сжатие gzip
    # 'w|bz2' - сжатие bzip2
    #  'w|xz' - сжатие lzma
    targz.add(fname)

os.path.getsize(fname)    # 120000
os.path.getsize(tarname)  # 445

os.remove(fname)
assert not os.path.isfile(fname)

with tarfile.open(tarname, 'r') as tar:
    tar.extractall()

with open(fname, 'r') as f:
    s = f.read()

print(s[:12])  # Compress me!
```

Для работы с разными типами архивов модуль `tarfile` использует инструменты из модулей [`gzip`](https://docs.python.org/3/library/gzip.html), [`bz2`](https://docs.python.org/3/library/bz2.html) и [`lzma`](https://docs.python.org/3/library/lzma.html).

Кроме рассмотренных модулей, для работы с архивами можно использовать функции [`make_archive`](https://docs.python.org/3/library/shutil.html#shutil.make_archive) и [`unpack_archive`](https://docs.python.org/3/library/shutil.html#shutil.unpack_archive) модуля [shutil](https://docs.python.org/3/library/shutil.html).

## Тестирование кода

Тестирование является важной частью разработки на python. В отсутствие проверок компилятора, тесты различных частей кода помогают обеспечить доверие к работе программы. В дополнение к тестам полезно использовать [статические анализаторы кода](https://en.wikipedia.org/wiki/Static_program_analysis), но мы не будем касаться этой темы.

Тесты кода можно разделить на два типа: тесты, проверяющие потребление ресурсов (времени и памяти), и тесты, проверяющие логику работы программы. Рассмотрим примеры выполнения тестов обоих типов.

### Модуль timeit

Модуль [`timeit`](https://docs.python.org/3/library/timeit.html) содержит инструменты для измерения времени работы небольших частей кода. Этот модуль можно использовать двумя способами: через консольный интерфейс и через вызов функций внутри кода. Начнем с интерфейса командной строки и классического сравнения функции `map`, генераторного выражения и спискового включения:

```sh
$ python -m timeit -r 10 -n 1000 'sum([x**2 for x in range(10000)])'
1000 loops, best of 10: 2.84 msec per loop
$ python -m timeit -r 10 -n 1000 'sum(map(lambda x: x**2, range(10000)))'
1000 loops, best of 10: 3.01 msec per loop
$ python -m timeit -r 10 -n 1000 'sum(x**2 for x in range(10000))'
1000 loops, best of 10: 2.79 msec per loop
```

Параметр `-n` определяет количество повторений, по которым будет вычисляться среднее время выполнения, параметр `-r` определяет количество повторений всей процедуры. Также можно использовать параметр `-s`, который позволяет задавать окружение, например:

```sh
-s 'import math'
```

Покажем теперь вызов модуля `timeit` в коде и добавим в сравнение отрывок кода с циклом `for`:

```py
import timeit

code1 = '''
sum=0
for i in range(10000):
    sum += i**2
'''
code2 = 'sum([x**2 for x in range(10000)])'
code3 = 'sum(map(lambda x: x**2, range(10000)))'
code4 = 'sum(x**2 for x in range(10000))'

for idx, c in enumerate([code1, code2, code3, code4]):
    print(f'code {idx+1}', end=': ')
    print(f'{timeit.timeit(c, number=1000):.5f}')
# code 1: 2.87627
# code 2: 2.83845
# code 3: 3.04344
# code 4: 2.83078
```

Функция `timeit.repeat` выполняет несколько тестов подряд (аналогично аргументу командной строки `-r`), что позволяет оценить разброс результатов и оценить точность измерения:

```py
for idx, c in enumerate([code1, code2, code3, code4]):
    res = timeit.repeat(c, number=1000, repeat=5)
    print(' '.join([f'{item:.3f}' for item in res]))
# code 1: 2.909 2.874 2.938 2.894 2.872
# code 2: 2.788 2.786 2.768 2.802 2.792
# code 3: 3.041 3.037 3.070 3.046 3.050
# code 4: 2.842 2.824 2.845 2.848 2.831
```

Функции модуля `timeit` могут принимать и другие аргументы. Детали можно найти [в документации](https://docs.python.org/3/library/timeit.html).

### Модуль unittest

Модуль [`unittest`](https://docs.python.org/3/library/unittest.html) предоставляет большой набор инструментов для [модульного тестирования кода](https://en.wikipedia.org/wiki/Unit_testing). Покажем базовые приемы тестирования на примере функции `quad_eq`, которая должна принимать числа `a`, `b` и `c` и возвращать действительные корни квадратного уравнения `ax^2+bx+c=0`:

```py
# файл quadeq.py
from math import sqrt

def quad_eq(a, b, c):
    D = b**2 - 4*a*c
    if D < 0:
        return []
    elif D == 0:
        return [-b/2 * a]
    return [
        (-b - sqrt(D)) / (2*a),
        (-b + sqrt(D)) / (2*a)
    ]
```

Найдем здесь ошибку с помощью тестов. Для этого определим наследника класса [`unittest.TestCase`](https://docs.python.org/3/library/unittest.html#unittest.TestCase). Методы этого класса, имена которых начинаются с символов `test`, задают набор тестов. В методах-тестах вызываются специальные методы класса `unittest.TestCase`, выполняющие проверки:

```py
# файл test_quadeq.py
from quadeq import quad_eq
import unittest

class TestQuadEq(unittest.TestCase):
    def test_integer_roots(self):
        # assertEqual(a, b) проверяет равенство a и b
        self.assertEqual(quad_eq(1, 3, 2), [-2, -1])
        self.assertEqual(quad_eq(1, -1, -2), [-1, 2])
        self.assertEqual(quad_eq(2, -2, -4), [-1, 2])

    def test_single_root(self):
        self.assertEqual(quad_eq(1, 2, 1), [-1])
        self.assertEqual(quad_eq(2, 4, 2), [-1])
        self.assertEqual(quad_eq(1, 6, 9), [-3])

    def test_no_roots(self):
        # assertFalse(a) проверяет, что bool(a) равно False
        self.assertFalse(quad_eq(1, 1, 1))
        self.assertFalse(quad_eq(1, 0, 1))

    def test_linear_equation(self):
        self.assertEqual(quad_eq(0, 1, 1), [-1])
        self.assertEqual(quad_eq(0, 2, 2), [-1])

    def test_not_an_equation(self):
        self.assertFalse(quad_eq(0, 0, 1))
        self.assertFalse(quad_eq(0, 0, 0))

    def test_wrong_type(self):
        # assertRaises(exception, callable) проверяет, что вызов
        # callable приводит к исключению типа exception
        self.assertRaises(TypeError, lambda: quad_eq(1, 2, '1'))
        self.assertRaises(TypeError, lambda: quad_eq(1, '2', 1))
        self.assertRaises(TypeError, lambda: quad_eq('1', 2, 1))

if __name__ == '__main__':
    unittest.main()
```

Эти тесты покрывают не все возможные случаи, однако их вполне достаточно для иллюстрации (и обнаружения нашей ошибки). Запустим тестирование:

```sh
$ python test_quadeq.py
.E.FF.
======================================================================
ERROR: test_linear_equation (__main__.TestQuadEq)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_quadeq.py", line 22, in test_linear_equation
    self.assertEqual(quad_eq(0, 1, 1), [-1])
  File "/home/vitaly/work/CppAndPython/playground/quadeq.py", line 10, in quad_eq
    (-b - sqrt(D)) / (2*a),
ZeroDivisionError: float division by zero

======================================================================
FAIL: test_not_an_equation (__main__.TestQuadEq)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_quadeq.py", line 26, in test_not_an_equation
    self.assertFalse(quad_eq(0, 0, 1))
AssertionError: [0.0] is not false

======================================================================
FAIL: test_single_root (__main__.TestQuadEq)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "test_quadeq.py", line 13, in test_single_root
    self.assertEqual(quad_eq(2, 4, 2), [-1])
AssertionError: Lists differ: [-4.0] != [-1]

First differing element 0:
-4.0
-1

- [-4.0]
+ [-1]

----------------------------------------------------------------------
Ran 6 tests in 0.006s

FAILED (failures=2, errors=1)
```

Модуль `unittest` обнаружил класс `TestQuadEq` и выполнил тесты. Первая строка

```sh
.E.FF.
```

показывает, что три теста завершились успешно (символы `'.'`), в двух из тестов была провалена проверка в assert-методе класса `unittest.TestCase` (символ `'F'`) и при выполнении еще одного теста было выброшено исключение (символ `'E'`). Отчет об ошибках, который вывел `unittest`, позволяет понять, что мы забыли проверить некоторые частные случаи перед применением основной формулы и поставить скобки около `2*a` при отрицательном дискриминанте. Внесем необходимые изменения:

```py
# файл quadeq.py
from math import sqrt

def quad_eq(a, b, c):
    if a == 0:
        return [-c / b] if b != 0 else []
    D = b**2 - 4*a*c
    if D < 0:
        return []
    elif D == 0:
        return [-b / (2*a)]
    return [
        (-b - sqrt(D)) / (2*a),
        (-b + sqrt(D)) / (2*a)
    ]
```

Теперь все тесты будут пройдены успешно:

```sh
 python test_quadeq.py
......
----------------------------------------------------------------------
Ran 6 tests in 0.000s

OK
```

Вызов с параметром `-v` (verbose) приведет к более подробному выводу:

```sh
$ python test_quadeq.py -v
test_integer_roots (__main__.TestQuadEq) ... ok
test_linear_equation (__main__.TestQuadEq) ... ok
test_no_roots (__main__.TestQuadEq) ... ok
test_not_an_equation (__main__.TestQuadEq) ... ok
test_single_root (__main__.TestQuadEq) ... ok
test_wrong_type (__main__.TestQuadEq) ... ok

----------------------------------------------------------------------
Ran 6 tests in 0.001s

OK
```

Заметим, что с последним тестом нам повезло, поскольку в функции `quad_eq` нет явной проверки правильности типов аргументов. Рассмотренный пример показывает далеко не все возможности модуля `unittest`. Полное описание модуля смотрите в [документации](https://docs.python.org/3/library/unittest.html).

Модуль `unittest` - не единственное средство для модульного тестирования в python. Для проверки решений заданий в этом курсе используется [`pytest`](https://docs.pytest.org/en/stable/) - другая популярная библиотека для тестирования.

### Модуль doctest

Хорошей практикой при написании комментариев к коду является включение в текст примеров использования функций. Модуль [`doctest`](https://docs.python.org/3/library/doctest.html) позволяет исполнять такие примеры и проверять, что приведенный код действительно приводит к ожидаемому результату. Включим некоторые примеры в строку описания функции `quad_eq` и проверим их работу с помощью модуля `doctest`:

```py
# файл quadeq.py
from math import sqrt
import doctest

def quad_eq(a, b, c):
    """ Finds rational roots of the equation ax^2 + bx + c = 0
        and returns a list of roots in ascending order.

        >>> quad_eq(1, 3, 2)
        [-2.0, -1.0]
        >>> quad_eq(1, 2, 1)
        [-1.0]
        >>> quad_eq(1, 1, 1)
        []
        >>> quad_eq(0, 0, 0)
        []
    """
    if a == 0:
        return [-c / b] if b != 0 else []
    D = b**2 - 4*a*c
    if D < 0:
        return []
    elif D == 0:
        return [-b / (2*a)]
    return [
        (-b - sqrt(D)) / (2*a),
        (-b + sqrt(D)) / (2*a)
    ]

if __name__ == '__main__':
    doctest.testmod()
```

Запускаем:

```sh
$ python quadeq.py
$ 
```

Все примеры были запущены и во всех случаях было получены ожидаемые результаты. В консоль при этом ничего не было выведено. Чтобы убедиться в том, что все произошло именно так, запустим программу еще раз, включив моду verbose:

```sh
$ python quadeq.py  -v
Trying:
    quad_eq(1, 3, 2)
Expecting:
    [-2.0, -1.0]
ok
Trying:
    quad_eq(1, 2, 1)
Expecting:
    [-1.0]
ok
Trying:
    quad_eq(1, 1, 1)
Expecting:
    []
ok
Trying:
    quad_eq(0, 0, 0)
Expecting:
    []
ok
1 items had no tests:
    __main__
1 items passed all tests:
   4 tests in __main__.quad_eq
4 tests in 2 items.
4 passed and 0 failed.
Test passed.
```

Работает.

Разработка программы может опираться на процедуру тестирования. При [таком подходе](https://habr.com/ru/post/206828/) сначала пишутся тесты, и только после этого - основная программа. Эта техника позволяет сразу писать код, который удовлетворяет необходимым контрактам, и быстро обнаруживать различные ошибки.  Покрытие кода тестами является признаком хорошего программного продукта. Не пренебрегайте модульным тестированием своих программ.

## Веб-программирование

Язык python хорошо подходит для работы с сетью: его стандартная библиотека имеет модули для работы с различными протоколами (например, [HTTP](https://ru.wikipedia.org/wiki/HTTP), [FTP](https://ru.wikipedia.org/wiki/FTP), [SMTP](https://ru.wikipedia.org/wiki/SMTP)); очень популярны фреймворки для разработки веб-сайтов на python (например, [Django](https://www.djangoproject.com/)). Подробный разговор об этом выходит далеко за пределы этого курса, однако несколько примеров работы с сетью мы всё же рассмотрим.

### Модуль urllib

Модуль [`urllib.requests`](https://docs.python.org/3/library/urllib.request.html) содержит функции и классы для доступа к ресурсам через [URL](https://ru.wikipedia.org/wiki/URL) (uniform resource locator, унифицированный указатель ресурса). Рассмотрим несколько примеров его использования с протоколом HTTP(S).

Некоторые веб-сайты предоставляют специальные инструменты для программного доступа к данным ([API](https://ru.wikipedia.org/wiki/API) - application programming interface, программный интерфейс приложения). Так, социальная сеть [Вконтакте](https://vk.com) имеет хорошо проработанный API. Получим имя пользователя по его идентификатору:

```py
import urllib.request
import urllib.parse
import json

protocol='https://'
base_url='api.vk.com/method'
method='users.get'
params = {
    'user_id' : 591408,     # идентификатор пользователя
    'access_token': vkkey,  # секрет
    'v': 5.52               # версия API
}
parstr = urllib.parse.urlencode(params)
url = f'{protocol}{base_url}/{method}?{parstr}'
with urllib.request.urlopen(url) as f:
    if f.getcode() == 200:  # статус OK
        data = json.loads(f.read())['response'][0]
    else:
        data = {}

for key, val in data.items():
    print(f'{key:>10}: {val}')
#         id: 591408
# first_name: Vitaly
#  last_name: Vorobyev
```

API-сервис Вконтакте работает через протокол HTTPS, `api.vk.com/method` - это адрес API-сервиса. Мы использовали API-метод `users.get` с тремя параметрами: идентификатор пользователя (`user_id`), ключ идентификации (`access_token`) и версия API (`v`). Параметры для вставки в URL склеили с помощью функции [`urllib.parse.urlencode`](https://docs.python.org/3/library/urllib.parse.html#urllib.parse.urlencode). Ключ идентификации является секретом и не должен оказываться в открытом доступе. Создать ключ для своего аккаунта Вконтакте можно с помощью [простой процедуры](https://vk.com/dev/access_token).

Функция [`urllib.request.urlopen`](https://docs.python.org/3/library/urllib.request.html#urllib.request.urlopen) выполнила метод GET протокола HTTP для указанного URL и вернула объект типа [`http.client.HTTPResponse`](https://docs.python.org/3/library/http.client.html#http.client.HTTPResponse). Статус-код `200` означает, что запрос был успешно обработан. Метод `HTTPResponse.read` позволяет прочитать полученные в ответ на запрос данные. В нашем случае данные получены в формате json, который мы десериализовали с помощью функции `json.reads`.

Метод `friends.get` API-сервиса Вконтакте позволяет получить список друзей пользователя:

```py
method='friends.get'
# ...
with urllib.request.urlopen(url) as f:
    if f.getcode() == 200:
        data = json.loads(f.read())['response']

print(f'count: {data["count"]}')
# count: 279
print(f'items: {data["items"][:5]}')
# items: [4834, 12521, 13121, 16351, 20537]
```

Вы можете сами поэкспериментировать API-сервисом Вконтакте, изучив [документацию](https://vk.com/dev/manuals).

Работа с API через URL-запросы, в которых задан метод с параметрами, является распространенным стандартом. Подобным образом можно работать с базой данных научных публикаций [INSPIREhep](https://inspirehep.net/). Найдем в ней десять публикаций Ричарда Фейнмана:

```py
addr='https://inspirehep.net/api'
params = {
    'q' : 'find a r feynman',
    'size': 10,
    'page': 1
}
parstr = urllib.parse.urlencode(params)
url = f'{addr}/literature?{parstr}'
with urllib.request.urlopen(url) as f:
    data = json.loads(f.read())

for item in data['hits']['hits']:
    mdata = item['metadata']
    first_auth = mdata['authors'][0]['full_name']
    title = mdata['titles'][0]['title']
    date = mdata['preprint_date']
    doc_type = mdata['document_type'][0]
    iid = item['id']
    print(f'{iid:->8}: {date:<11} {first_auth:>13} {doc_type}\n  "{title}"')
```

Мы снова получили данные формате json. Результаты нашего запроса:

```sh
--894667: 1939        Feynman, R.P. thesis
  "Forces and Stresses in Molecules"
-1115227: 1976-11       Field, R.D. article
  "Quark Elastic Scattering as a Source of High Transverse Momentum Mesons"
-1115223: 1952          Brown, L.M. article
  "Radiative corrections to Compton scattering"
---61328: 1970        Feynman, R.P. article
  "Some comments on baryonic states"
---69949: 1971        Feynman, R.P. conference paper
  "The quark model at low energies"
---46626: 1949-05-15  Feynman, R.P. article
  "Equations of State of Elements Based on the Generalized Fermi-Thomas Theory"
---47515: 1953-09-15  Feynman, R.P. article
  "Atomic Theory of Liquid Helium Near Absolute Zero"
---42560: 1948        Feynman, R.P. article
  "Relativistic cutoff for quantum electrodynamics"
--942923: 1955-02-01  Feynman, R.P. article
  "Slow Electrons in a Polar Crystal"
--427379: 1996        Feynman, R.P. book
  "Feynman lectures on gravitation"
```

Первая запись имеет тип thesis. Мы обранужиди диссертацию Фейнмана. Давайте скачаем ее текст средствами `urllib.requests`:

```py
itype='literature'
iid=894667
url = f'https://inspirehep.net/api/{itype}/{iid}'
with urllib.request.urlopen(url) as f:
    data = json.loads(f.read())

fulltexturl = None
for doc in data['metadata']['documents']:
    if doc['fulltext']:
        fulltexturl = doc['url']
        print('Full text found!')
        break

if fulltexturl:
    with urllib.request.urlopen(fulltexturl) as f:
        with open('feynman_thesis.pdf', 'wb') as of:
            of.write(f.read())
```

У нас получилось:

```py
import os
fname='feynman_thesis.pdf'
if os.path.isfile(fname):
    print(os.path.getsize(fname))
# 2336577
```

Если Вас заинтересовали рассмотренные примеры, обратите внимание на более удобную для работы с HTTP запросами библиотеку [`requests`](https://requests.readthedocs.io/en/master/), которая не входит в набор модулей стандартной библиотеки.

<!-- ## Функциональное программирование

### Модуль functools

### Декораторы

## Асинхронное программирование

### Модуль asyncio -->

## Резюме

В этом разделе были рассмотрены некоторые модули стандартной библиотеки python, полезные для

* сериализации объектов
* сжатия данных
* тестирования кода
* веб-программирования

Были рассмотрены примеры работы с новыми инструментами, которые позволяют продолжить их самостоятельное использование и дальнейшее изучение.

## Источники

* [The Hitchhiker’s Guide to Python. Data Serialization](https://docs.python-guide.org/scenarios/serialization/)
* [Обрабатываем csv файлы](https://python-scripts.com/import-csv-python)
* [Пользовательские атрибуты в Python](https://habr.com/ru/post/137415/)
* [Python zlib Library Tutorial](https://stackabuse.com/python-zlib-library-tutorial/)
* [PyTest](https://habr.com/ru/post/269759/)

<!-- * [Getting Started With Async Features in Python](https://realpython.com/python-async-features/)
* [Async IO in Python: A Complete Walkthrough](https://realpython.com/async-io-python/)
* [An Introduction to Asynchronous Programming in Python](https://medium.com/velotio-perspectives/an-introduction-to-asynchronous-programming-in-python-af0189a88bbb)
* [Сокеты в Python для начинающих](https://habr.com/ru/post/149077/)
* [Введение в REST API — RESTful веб-сервисы](https://habr.com/ru/post/483202/) -->
