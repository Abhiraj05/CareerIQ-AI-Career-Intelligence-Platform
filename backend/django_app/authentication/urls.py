from django.urls import path
from .views import UserSignupView, UserLoginView, MeView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='user_signup'),
    path('login/', UserLoginView.as_view(), name='user_login'),
    path('me/', MeView.as_view(), name='user_me'),
]
