from django.conf.urls import include, url
import demo.views as v

urlpatterns = [
    url(r'^$', v.main, name='main'),
    url(r'get_auth_key/$', v.get_auth_key, name='get_auth_key'),
    

]