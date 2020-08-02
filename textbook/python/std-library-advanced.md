---
title: Стандартные модули II
menu: textbook-python
---

Этот раздел продолжает обзор модулей стандартной библиотеки python. Объем материала не позволяет обсуждать модули во всех деталях. В большинстве случаев мы показываем простые и наиболее характерные случаи использования различных инструментов.

## Сериализация объектов

[Сериализация](https://en.wikipedia.org/wiki/Serialization) - это процесс перевода объектов в формат, в котором их можно хранить или передавать. Обратный процесс назвается десериализацией.

### Текстовое представление

В [разделе про ООП](oop.md) мы обсуждали метод `__repr__`, который возвращает текстовое представления объекта. В комбинации с функцией [`literal_eval`](https://docs.python.org/3/library/ast.html#ast.literal_eval) модуля [`ast`](https://docs.python.org/3/library/ast.html) его можно использовать для сериализации и десериализации объектов python:

```py
import ast

# создаем список, содержащий объекты различных стандартных типов
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

Объекты при этом хранятся в текстовом формате. Это удобно тем, что данные прямо доступны для чтения человеком.

### Модуль pickle

Модуль [`pickle`](https://docs.python.org/3/library/pickle.html) содержит инструменты для сериализации (и десериализации) стандартных объектов python в последовательность байтов:

```py
# сохраняем бинарное представление в файл
with open('s1.dat', 'wb') as f:
    pickle.dump(data, f)

# читаем файл и конструируем точную копию исходного объекта
with open('s1.dat', 'rb') as f:
    restored_data = pickle.load(f)

type(restored_data)     # <class 'list'>
type(restored_data[4])  # <class 'tuple'>
print(restored_data)
# [1, 2, 'a', ['2', 1], (3, 2, 1), {0: 0, 1: 1, 2: 4}]
```

Мы сравнили скорость выполнения этих двух примеров. Запись и чтение данных в текстовом формате в среднем занимает около 180 микросекунд, а с модулем `pickle` и при работе с бинарным представлением - около 80 микросекунд.

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

Чтобы определить правила сериализации для нового типа данных, необходимо определить класс-наследник класса [json.JSONEncoder](https://docs.python.org/3/library/json.html#json.JSONEncoder). Во многих случаях объекты пользовательских типов могут быть сериализованы через атрибут `__dict__`. Подробное обсуждение сериализации произвольных объектов выходит за рамки этого обзора.

Стандартная библиотека python содержит и другие модули, позволяющие выполнять сериализацию данных, например, [cvs](https://docs.python.org/3/library/csv.html) и [xml](https://docs.python.org/3/library/xml.html). Из нестандартных инструментов упомянем библиотеку [pyyaml](https://pyyaml.org/wiki/PyYAMLDocumentation) и мощную библиотеку для сериализации от компании Google [protobuf](https://developers.google.com/protocol-buffers).

## Сжатие данных

### Модуль zlib

Модуль [`zlib`](https://docs.python.org/3/library/zlib.html) предоставляет интерфейс к библиотеке [zlib](https://en.wikipedia.org/wiki/Zlib), написанной на языке C, и содержит инструменты для архивирования и разархивирования последовательности байтов.

Функция [`zlib.compress`](https://docs.python.org/3/library/zlib.html#zlib.compress) принимает последовательность байт и возвращает объект, содержащий сжатые данные:

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

Второй параметр функции `zlib.compress` - целое число от 0 до 9 - определяет степень и скорость сжатия. Значение второго параметра -1 означает степень сжатия по умолчанию 6. Чтобы сжать файл, достаточно прочитать его содержимое в бинарной моде и передать в функцию `zlib.compress`.

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

## Инструменты тестирования кода

Тестирование является важной частью разработки на python. В отсутствие проверок компилятора, только тесты различных частей кода могут обеспечить доверие к работе программы. В дополнение к тестам полезно использовать [статические анализаторы кода](https://en.wikipedia.org/wiki/Static_program_analysis), но мы не будем касаться этой темы.

Тесты кода можно разделить на два типа: тесты, проверяющие потребление ресурсов (времени и памяти), и тесты, проверяющие логику работы программы. Рассмотрим кратко инструменты для выполнения тестов обоих типов.

### Модуль timeit

Модуль [`timeit`](https://docs.python.org/3/library/timeit.html) содержит инструменты для измерения времени рыботы небольших частей кода. Этот модуль можно использовать двумя способами: через консольный интерфейс и через вызов функций внутри кода. Рассмотрим примеры использования `timeit` в обоих вариантах. Начем с интерфейса командной строки и классического сравнения функции `map`, генераторного выражения и спискового включения:

```sh
$ python -m timeit -r 10 -n 300 'sum([x**2 for x in range(10000)])'
300 loops, best of 10: 2.94 msec per loop
$ python -m timeit -r 10 -n 300 'sum(map(lambda x: x**2, range(10000)))'
300 loops, best of 10: 3.23 msec per loop
$ python -m timeit -r 10 -n 300 'sum(x**2 for x in range(10000))'
300 loops, best of 10: 3 msec per loop
```

Параметр `-n` определяет количество повторений, по которым будет вычисляться среднее время выполнения, параметр `-r` определяет количество повторений всей процедуры. Также можно использовать параметр `-s`, который позволяет задавать окружение, например:

```sh
-s 'import math'
```

Повторим эти тесты дргим способом:

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
    print(timeit.timeit(c, number=1000))
# code 1: 3.127008237002883
# code 2: 3.0126645540003665
# code 3: 3.449164818994177
# code 4: 3.0346789190007257
```

Функция `timeit.repeat` выполняет несколько тестов подряд (аналогично аргументу командной строки `-r`), что позволяет оценить разброс результатов и оценить точность измерения:

```py
for idx, c in enumerate([code1, code2, code3, code4]):
    print(f'code {idx+1}', end=': ')
    print(timeit.repeat(c, number=1000, repeat=5))
# code 1: [3.4939, 3.4108, 3.4397, 3.4448, 3.5088]
# code 2: [3.4069, 3.3554, 3.4422, 3.4873, 3.4216]
# code 3: [3.7350, 3.8240, 3.7261, 3.8074, 3.7340]
# code 4: [3.3718, 3.3163, 3.4104, 3.4044, 3.2933]
```

Функции модуля `timeit` могут принимать и некоторые другие аргументы. Детали можно найти [в документации](https://docs.python.org/3/library/timeit.html).

### Модуль unittest

Модуль [`unittest`](https://docs.python.org/3/library/unittest.html) предоставляет богатый набор инструментов для модульного тестирования кода. Проиллюстрируем базовые идеи тестирования на простом примере. Пусть функция `quad_eq` принимает три числа `a`, `b` и `c` и возвращает действительные корни квадратного уравнения `ax^2+bx+c=0`:

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

Найдем ошибку в этом коде с помощью тестов:

```py
# файл test_quadeq.py

```

### Модуль pytest

Библиотека [`pytest`](https://docs.pytest.org/en/stable/) не входит в число стандартных модулей, однако мы включили ее в этот обзор. 

### Модуль doctest

## Web-программирование

### Модуль urllib

### Библиотека requests

## Модуль functools

## Модуль asyncio

## Резюме

## Источники

* [The Hitchhiker’s Guide to Python. Data Serialization](https://docs.python-guide.org/scenarios/serialization/)
* [Обрабатываем csv файлы](https://python-scripts.com/import-csv-python)
* [Пользовательские атрибуты в Python](https://habr.com/ru/post/137415/)
* [Python zlib Library Tutorial](https://stackabuse.com/python-zlib-library-tutorial/)
* [PyTest](https://habr.com/ru/post/269759/)
