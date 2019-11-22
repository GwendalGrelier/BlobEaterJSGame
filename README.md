# BlobEaterJSGame
Basic JavaScript Game

Blob Eater is a small game developped in HTML/CSS and Javascript.
The main goal is to survive as long as possible in an hostile environment where your are swamped by a continuous wave 
of enemy blobs.

![Alt text](/img/screenshot.png?raw=true)


This is you: 

![Alt text](/img/player.png?raw=true) 
The player movement is controled by keyboard events on the arrow keys. 
A sprint effect can be applied by pressing the `space bar`.


These are moving enemies: 

![Alt text](/img/enemy.png?raw=true) 
A first wave will spawn at a pretty 
fast rate at the start of the game and then continuously. 
Their initial position and and direction are random  but will always be placed 
at the top of the screen.


These are fixed blobs:

![Alt text](/img/fixedBlob.png?raw=true) 
They will spawn at a fixed rate but at random position and size. 
They will grow gradually up to their final size, during this period of time they won't be 
deadly.

These are bonus blobs:

![Alt text](/img/bonus.png?raw=true)
They will spawn every 25secs and will make you invincible for a short period of time.
Use this time to clean the area and eat as much enemies as you can.


Points can be optained by surviving and eating blobs.
