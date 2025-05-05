from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Question
from .serializers import QuestionSerializer
from rest_framework import viewsets
from api.judge0_calls import get_languages, get_submission_token, check_submission_status,compile_code
from api.gemini_api_calls import generate_hints, ask_ai
from django.contrib import admin


class GetLanguagesView(APIView):
    def get(self, request):
        return Response(get_languages())

class CompileCodeView(APIView):
    def post(self, request):
        source_code = request.data.get("source_code")
        lang_id = request.data.get("language_id")
        testcases = request.data.get("testcases")
        return Response(compile_code(source_code,lang_id,testcases))


class GenerateHintsView(APIView):
    def post(self, request):
        data = request.data
        response = generate_hints(data)
        return Response({"response": response})
        

class AskAIView(APIView):
    def post(self, request):
        data = request.data
        response = ask_ai(data)
        return Response({"response": response})



@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ('question_id', 'title', 'difficulty', 'topics', 'time_limit_per_test')
    search_fields = ('title', 'topics', 'companies')


# ViewSet for the Question model
class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer