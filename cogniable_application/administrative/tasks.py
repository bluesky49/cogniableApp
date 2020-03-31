from celery import shared_task
from time import sleep

@shared_task
def adding_task(x, y):
    sleep(45)
    return x + y