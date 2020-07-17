---
title: Стандартные модули python, часть I
menu: textbook-python
glob_doc: https://docs.python.org/3/library/glob.html
---

Стандартная библиотека python [очень обширна](https://docs.python.org/3/library/). В ней есть инструменты для работы с [файловой системой](https://docs.python.org/3/library/filesys.html), [сервисами операционной системы](https://docs.python.org/3/library/allos.html), [поддержка многопоточности](https://docs.python.org/3/library/concurrency.html), [инструменты для работы с сетью](https://docs.python.org/3/library/ipc.html) и многие другое. В этом разделе мы рассмотрим несколько стандартных модулей python.

## Работа с операционной системой

### Модуль sys

[Модуль sys](https://docs.python.org/3/library/sys.html) обеспечивает доступ к параметрам и функциям операционной системы.

Список `sys.argv` хранит имя запущенного скрипта и аргументы командной строки, переданные при его запуске:

```py
# test.py

import sys
for idx, item in enumerate(sys.argv):
    print(f'Arg {idx}: {item:8} {type(item)}')
```

```sh
user@host:~$ python test.py arg1 arg2 345
Arg 0: test.py  <class 'str'>
Arg 1: arg1     <class 'str'>
Arg 2: arg2     <class 'str'>
Arg 3: 345      <class 'str'>
```

Переменная `sys.executable` позволяет узнать какой именно интерпретатор python используется:

```py
print(sys.executable)
# /home/vitaly/miniconda3/envs/tf2/bin/python
```

Функция [`sys.exit`](https://docs.python.org/3/library/sys.html#sys.exit) позволяет завершить выполнение программы. Эта функция принимает один аргумент - код выхода, который по умолчанию равен нулю. Большинство систем будет считать код 0 признаком успешного завершения программы, а любое другое число от 1 до 127 будет считать признаком ненормального завершения. Если передан объект другого типа, то он будет выведен в стандартный поток вывода, а код выхода будет равен 1. Функиця `sys.exit` всегда генерирует исключение [SystemExit](https://docs.python.org/3/library/exceptions.html#SystemExit), поэтому не стоит рассматривать ее как стандартный способ завершения программы. Используйте ее только в подходящих случаях, которые чаще всего связаны с невозможностью продолжения работы программы.

Переменная [`sys.path`](https://docs.python.org/3/library/sys.html#sys.path) обеспечивает доступ к переменной окружения `PYTHONPATH`. Эта переменная содержит список путей, в которых выполняется поиск модулей. Если необходимый модуль расположен в директории, которая не входит в `PYTHONPATH`, то перед подключением этого модуля неободимо добавить эту директорию в переменную `sys.path`:

```py
# 'path/to/my/facorite/module/dir/mymodule.py'
sys.path.append('path/to/my/facorite/module/dir')
import mymodule
```

Можно указывать абсолютный или относительный путь. Модуль sys имеет еще много инструментов, которые описаны в [документации](https://docs.python.org/3/library/sys.html).

### Модуль os

[Модуль os](https://docs.python.org/3/library/os.html) предоставляет инструменты для работы с операционной системой и файловой системой.

Функции [os.getenv](https://docs.python.org/3/library/os.html#os.getenv) и [os.putenv](https://docs.python.org/3/library/os.html#os.putenv) позволяют получать и изменять значения переменных окружения. Функция [os.system](https://docs.python.org/3/library/os.html#os.system) позволяет выполнять консольные команды, запуская при этом дочерний процесс. Рассмотрим следующий скрипт:

```py
# test.py
import os
import sys

print(f'  HOME: {os.getenv("HOME")}')

os.putenv('NEWENV', 'value')
print(f'NEWENV: {os.getenv("NEWENV")}')
if os.getenv('NEWENV') is not None:
    sys.exit(0)
os.system('python test.py')
```

При работе скрипта можно получить вывод, подобный такому:

```sh
  HOME: /home/vitaly
NEWENV: None
  HOME: /home/vitaly
NEWENV: value
```

Разберемся с тем что произошло. Переменная окружения `HOME` содержит путь к домашней директории пользователя. Мы получили значение этой переменной с помощью `os.genenv` (в данном случае `/home/vitaly`) и вывели его в консоль. Затем, c помощью `sys.putenv`, мы задали значение `value` новой переменной окружения `NEWENV` и сразу прочитали его. Функция `os.getenv` вернула `None`, поскольку функция `sys.putenv` оказывает влияние только на окружение дочерних процессов. Чтобы это проверить, мы снова запустили интерпретатор python с нашим скриптом `test.py`, используя `os.system`. В дочернем процессе снова были выведены переменные окружения `HOME` и `NEWENV`. В дочернем процессе переменная `NEWENV` определена, поэтому сработало условие для выхода из прогруммы с помощью `sys.exit(0)`.

Функция [`os.listdir`](https://docs.python.org/3/library/os.html#os.listdir) возвращает список названий объектов, лежащий в заданной директории.

### Модуль os.path

Модуль [os.path](https://docs.python.org/3/library/os.path.html) содержит полезные инструменты для работы с путями файловой системы. Функция [os.path.exists](https://docs.python.org/3/library/os.path.html#os.path.exists) проверяет указывает ли путь на существующий объект в файловой системе. Функция [os.path.isfile](https://docs.python.org/3/library/os.path.html#os.path.isfile) имеет схожий смысл, но возвращает `True` только в том случае, если объект является обычным файлом (не директория и не ссылка):

```py
os.path.exists('/home/vitaly')  # True
os.path.exists('/home/david')   # False
os.path.isfile('/home/vitaly')  # False
```

Функции [`os.path.join`](https://docs.python.org/3/library/os.path.html#os.path.join), [`os.path.split`](https://docs.python.org/3/library/os.path.html#os.path.split) и [`os.path.splitext`](https://docs.python.org/3/library/os.path.html#os.path.splitext) выполняют часто встречающиеся манипуляции со строками путей:

```py
path = os.path.join('/home', 'vitaly', 'test.py')  # /home/vitaly/test.py
head, tail = os.path.split(path)  # ['/home/vitaly', 'test.py']
root, ext = os.path.splitext(path)  # ['/home/vitaly/test', '.py']
```

### Модуль shutil

Модуль [`shutil`](https://docs.python.org/3/library/shutil.html) предоставляет высокоуровневые инструменты для операций с файлами. Вот несколько примеров:

```py
shutil.copy('filename', 'path/to/dir')  # копирование файла в директорию
shutil.copyfile('filename1', 'filename2')  # копирование файла в файл с другим именем
shutil.copytree('path/to/dir1', 'path/to/dir2')  # рекурсивное копирование директории dir1 в директорию dir2
shutil.rmtree('path/to/dir')  # рекурсивное удаление содержимого директории dir
shutil.move(src, dst)  # рекурсивное перемещение файла или директории
```

### Модуль glob

Модуль [`glob`]({{page.glob_doc}}) позволяет выполнять поиск объектов в файловой системе, имена которых удовлетворяют заданному паттерну:

```py
text_files = glob.glob('./*.txt')  # список текстовых файлов в текущей директории
text_files_all = glob.glob('./**/*.py', recursive=True)  # рекурсивный поиск файлов с расширением .py, начиная с текущей директории
```

## Работа со строками

### Модуль string

Модуль [`string`](https://docs.python.org/3/library/string.html) содержит различные инструмены для работы со строками, многие из которых дублируют возможности стандартного типа `str`. Модуль `string` содержит набор констант, которые часто оказываются полезны:

```py
string.ascii_lowercase  # 'abcdefghijklmnopqrstuvwxyz'
string.ascii_uppercase  # 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
string.ascii_letters    # 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
string.digits           # '0123456789'
string.punctuation      # !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
```

### Модуль re

Модуль [`re`](https://docs.python.org/3/library/re.html) содержит инструменты для работы с регулярными выражениями. Обсуждение регулярных выражений выходит за рамки этого курса. Мы рекомендуем читателю самостоятельно изучить базовые приемы работы с регулярными выражениями.

## Вычисления с произвольной точностью

### Модуль decimal

Модуль [`decimal`](https://docs.python.org/3/library/decimal.html) позволяет выполнять арифметические операции с плавающей точной с фиксированной точностью:

```py
from decimal import *

getcontext().prec = 6
Decimal(1) / Decimal(7)  # Decimal('0.142857')

getcontext().prec = 28
Decimal(1) / Decimal(7)  # Decimal('0.1428571428571428571428571429')
```

Объекты `Decimal` представлены в памяти точно. Это значит, что числа `Decimal` можно сравнивать с помощью операторов `==` и `!=`, не опасаясь погрешности из-за округления двоичного представления (как это происходит в случае с типом `float`).

В модуле `decimal` доступны некоторые математические функции:

```py
getcontext().prec = 28
Decimal(2).sqrt()      # Decimal('1.414213562373095048801688724')
Decimal(1).exp()       # Decimal('2.718281828459045235360287471')
Decimal('10').ln()     # Decimal('2.302585092994045684017991455')
Decimal('10').log10()  # Decimal('1')
```

### Модуль fractions

Тип `Fraction` из модуля [`fractions`](https://docs.python.org/3/library/fractions.html) описывает рациональные числа - числа, которые можно представить в виде обычновенной дроби:

```py
from fractions import Fraction
from math import pi, cos
Fraction(16, -10)  # Fraction(-8, 5)
Fraction('3.1415926535897932').limit_denominator(1000)  #Fraction(355, 113)
Fraction(cos(pi/3))  # Fraction(4503599627370497, 9007199254740992)
```

В последнем примере мы воспользовались модулем [`math`](https://docs.python.org/3/library/math.html), который мы не будем обсуждать, поскольку его возможности перекрываются модулем `numpy`. Модуль `numpy` будет рассмотрен в следующих частях.

<!-- ### Модуль mpmath (это не стандартный пакет) -->

## Продвинутые структуры данных и эффективное итерирование

### Модуль queue

Модуль [`queue`](https://docs.python.org/3/library/queue.html) содержит реализацию нескольких структур данных, среди которых FIFO-очередь `queue.Queue` и очередь с приоритетом `queue.PriorityQueue`. Очередь с приоритетом возвращает не первый добавленный элемент, а наименьший:

```py
from queue import Queue, PriorityQueue
arr = [3, 6, 1, 9, 4, 7, 2, 5, 8, 1]

q = Queue()
for i in arr:
    q.put_nowait(i)

while not q.empty():
    print(q.get_nowait(), end=' ')
# 3 6 1 9 4 7 2 5 8 1

pq = PriorityQueue()
for i in arr:
  pq.put_nowait(i)

while not pq.empty():
    print(pq.get_nowait(), end=' ')
# 1 1 2 3 4 5 6 7 8 9
```

Типы модуля `queue` созданы для работы в многопоточной среде исполнения. С особенностями многопоточной работы, которые мы не будем обсуждать, связано использование методов `get_nowait` и `put_nowait` вместо `get` и `put`.

### Модуль collections

Модуль [`collections`](https://docs.python.org/3/library/collections.html) расширяет набор стандартных контейнеров python. Рассмотрим три типа данных из этого модуля.

Функция [`namedtuple()`](https://docs.python.org/3/library/collections.html#namedtuple-factory-function-for-tuples-with-named-fields) позволяет создавать типы данных с именоваными полями:

```py
from collections import namedtuple
Vector = namedtuple('Vector', ['x', 'y', 'z'])
v1 = Vector(1., 0.5, 0.6)
v1.x  # 1.
v1.y  # 0.5
v1.z  # 0.6
```

Тип [`deque`](https://docs.python.org/3/library/collections.html#collections.deque) реализует контейнер двусторонняя учередь, или дек. Это последовательный контейнер, который позволяет эффективно добавлять и удалять элементы в начало и в конец:

```py
from collections import deque
deq = deque([1, 3, 5])
deq.append('a')        # [1, 3, 5, 'a']
deq.appendleft(False)  # [False, 1, 3, 5, 'a']
a = deq.pop()          # a = 'a', deq = ['False', 1, 3, 5]
b = deq.popleft()      # b = False, deq = [1, 3, 5]
```

Тип [`Counter`](https://docs.python.org/3/library/collections.html#collections.Counter) является подклассом типа `dict` и позволяет удобно подсчитывать количество вхождений элементов в контейнере, например:

```py
from collections import Counter
the_longest_word_in_english = 'pneumonoultramicroscopicsilicovolcanoconiosis'
cnt = Counter(the_longest_word_in_english)
for key, val in cnt.items():
    print(f'{key}: {val}', end=', ')
# p: 2, n: 4, e: 1, u: 2, m: 2, o: 9, l: 3, t: 1, r: 2, a: 2, i: 6, c: 6, s: 4, v: 1
cnt.most_common(1)  # [('o', 9)]
```

### Модуль itertools

Модуль [`itertools`](https://docs.python.org/3/library/itertools.html) содержит множество инструментов для эффективного итерирования по элементам контейнеров. Эффективное в данном случае означает, что необходимое следующее значение генерируется на лету, без хранения всех значений, количество которых может быть очень большое. Рассмотрим несколько инструментов из этого модуля:

```py
import itertools
arr = list(range(5))  # arr = [0, 1, 2, 3, 4]

for item in itertools.accumulate(arr):
    print(item, end=' ')
# 0 1 3 6 10

for perm in itertools.permutations(arr):
    print(''.join(map(str, perm)), end=' ')
# 01234 01243 01324 01342 01423 01432 ...

for comb in itertools.combinations(arr, 3):
    print(''.join(map(str, comb)), end=' ')
# 012 013 014 023 024 034 123 124 134 234
```

## Время и дата с модулем datetime

Модуль [`datetime`](https://docs.python.org/3/library/datetime.html) позволяет полноценно работать с объектами даты и времени:

```py
from datetime import date, timedelta
d1 = date.fromisoformat('2019-12-04')
d2 = date(2002, 12, 31)
d1 < d2  # False
delta = d1 - d2
delta.days  # 6182
type(delta)  # <class 'datetime.timedelta'>

delta2 = timedelta(days=15)
d3 = d1 + delta2  # 2019-12-19
d3.weekday()  # 3 (Среда)
d4 = date.today()  # 2020-07-15
```

```py
import time
from datetime import datetime
dt1 = datetime.fromtimestamp(time.time())  # 2020-07-15 21:47:09.036145
dt2 = datetime.fromisoformat('2020-07-15 21:47:09.036145')
dt2.timestamp() # 1594824429.036145 (секунд прошло с 1970-01-01)
```

## Резюме

В этом разделе мы выполнили краткий обзор возможностей некоторых стандартных модулей языка python. На этаме планирования нового проекта на python разумно изучить возможности существующих модулей (не только стандартных). Большое сообщество разработчиков и разнообразие доступных модулей являются сильными сторонами python.

## Источники

* [https://docs.python.org/3/library/](https://docs.python.org/3/library/)
* [Batteries Included Philosophy](https://www.python.org/dev/peps/pep-0206/#id3)
