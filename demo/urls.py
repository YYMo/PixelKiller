from django.conf.urls import include, url
import demo.views as v

urlpatterns = [
    url(r'^$', v.main, name='main'),


]