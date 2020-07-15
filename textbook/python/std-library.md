---
title: Полезные модули стандартной библиотеки

glob_doc: https://docs.python.org/3/library/glob.html
---

# {{ page.title }}

Стандартная библиотека python [очень обширна](https://docs.python.org/3/library/). В ней есть инструменты для работы с [файловой системой](https://docs.python.org/3/library/filesys.html), [сервисами операционной системы](https://docs.python.org/3/library/allos.html), [поддержка многопоточности](https://docs.python.org/3/library/concurrency.html), [инструменты для работы с сетью](https://docs.python.org/3/library/ipc.html) и многие другое. В этом разделе мы рассмотрим несколько примероы применения стандартных библиотек.

## Работа с операционной и файловой системой

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

Модуль [`re`](https://docs.python.org/3/library/re.html) содержит инструменты для работы с регулярными выражениями. Подробное обсуждение регулярных выражений выходит за рамки этого курса. Мы рекомендуем читателю самостоятельно изучить базовые приемы работы с регулярными выражениями.

## Вычисления с произвольной точностью

### Модуль decimal

### Модуль fractions

### Модуль mpmath

## Продвинутые структуры данных и эффективное итерирование

### Модуль collections

### Модуль itertools

### Модуль json

## Время и дата

### Модуль datetime

### Модуль calendar

## Сжатие данных

### Модуль zlib

## Инструменты тестирования

### Модуль timeit

### Модуль pytest и unittest

### Модуль doctest

## Заключение



## Источники

* [https://docs.python.org/3/library/](https://docs.python.org/3/library/)
* [Batteries Included Philosophy](https://www.python.org/dev/peps/pep-0206/#id3)
