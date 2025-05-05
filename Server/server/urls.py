from django.contrib import admin
from django.urls import path
from App.views import GetLanguagesView, CompileCodeView, GenerateHintsView, AskAIView, HomePageView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('languages/', GetLanguagesView.as_view(), name='get_languages'),
    path('compile/', CompileCodeView.as_view(), name='compile_code'),
    path('hints/', GenerateHintsView.as_view(), name='generate_hints'),
    path('askAI/', AskAIView.as_view(), name='ask_ai'),
    path('', HomePageView.as_view(), name='home'),  # Added HomePageView
]
