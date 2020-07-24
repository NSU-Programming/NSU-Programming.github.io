---
title: Графика и GUI с библиотекой pygame
menu: textbook-python
---

## Пакет pygame

Библиотека `pygame` представляет собой простой фреймворк для разработки игр на python. Разработка игр не является предметом этого курса, однако инструменты `pygame` могут оказаться полезными для различных интерактивных визуализаций. В этом разделе мы напишем простую программу с использованием `pygame`.

Для начала необходимо подключить библиотеку и выполнить инициализацию:

```py
import pygame

pygame.init()
```

### Главный цикл

Интерактивные программы обычно содержат главный цикл, который обрабатывает события. Одним из таких событий является выход из программы. Напишем сразу заготовку основного цикла и обработкой события выхода:

```py
while True:
    pygame.display.update()
    for event in pygame.event.get():
        if event.type == pygame.locals.QUIT:
            pygame.quit()
            sys.exit()
```

Метод `pygame.display.update()` применяет изменения, произошедшие в текущей итерации цикла.

### События

В ходе работы программы генерируются события, например, когда пользователь кликает мышкой или нажимает кнопку на клавиатуре. Вызов `pygame.event.get()` возвращает список текущих событий.

### Экран монитора

Все события происходят внутри окна, размер которого (в пикселях) задается с помощью функции `display.set_mode()`:

```py
DISPLAYSURF = pygame.display.set_mode((300, 300))
DISPLAYSURF.fill(pygame.Color(255, 255, 255))  # заполняем белым цветом
pygame.display.set_caption("Game")  # заголовок окна
```

### Графические объекты

Поместим на экран круг:

```py
color = pygame.Color(128, 128, 128)
position = (200, 50)
radius = 30
pygame.draw.circle(DISPLAYSURF, color, position, radius)
```

Координаты на экране отсчитываются от левого верхнего угла. Цвета задаются в схеме RGB.

Другие функции для рисования:

* `pygame.draw.polygon(surface, color, pointlist, width)`
* `pygame.draw.line(surface, color, start_point, end_point, width)`
* `pygame.draw.lines(surface, color, closed, pointlist, width)`
* `pygame.draw.circle(surface, color, center_point, radius, width)`
* `pygame.draw.ellipse(surface, color, bounding_rectangle, width)`
* `pygame.draw.rect(surface, color, rectangle_tuple, width)`

### Частота обновления

```py
FPS = 30
FramePerSec = pygame.time.Clock()

while True:
    # ...
    FramePerSec.tick(FPS)
```



## Источники

* [Python pygame – The Full Tutorial](https://coderslegacy.com/python/python-pygame-tutorial/)
* [Game Loop pattern](https://www.patternsgameprog.com/discover-python-and-patterns-8-game-loop-pattern/)
* [dr0id pygame tutorials](https://dr0id.bitbucket.io/legacy/pygame_tutorials.html)
