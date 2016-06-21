from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings

# main page
def main(request):
    template = 'main.html'
    context = {}
    return render(request, template, context)

# return consumer key
def get_auth_key(request):
    data = {'consumer_key':settings.CONSUMER_KEY}
    return JsonResponse(data)