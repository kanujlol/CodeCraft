from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets
from api.judge0_calls import get_languages, get_submission_token, check_submission_status,compile_code
from api.gemini_api_calls import ask_ai,generate_hints
from django.contrib import admin


class GetLanguagesView(APIView):
    def get(self, request):
        return Response(get_languages())

class CompileCodeView(APIView):
    def post(self, request):
        source_code = request.data.get("source_code")
        lang_id = request.data.get("language_id")
        question_id = request.data.get("question_id")
        return Response(compile_code(source_code,lang_id,question_id))


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



class HomePageView(APIView):
    def get(self, request):
        return Response({"message": "Success", "status": 200})