from django.conf.urls import include, url
import demo.views as v

urlpatterns = [
    url(r'^$', v.main, name='main'),
    url(r'get_auth_key/$', v.get_auth_key, name='get_auth_key'),
    url(r'get_auth_request_token/$', v.get_auth_request_token, name='get_auth_request_token'),
    url(r'get_auth_access_token/$', v.get_auth_access_token, name='get_auth_access_token'),
    url(r'get_auth_resource_token/$', v.get_auth_resource_token, name='get_auth_resource_token'),
]