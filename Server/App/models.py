from django.db import models

class Question(models.Model):
    DIFFICULTY_LEVELS = [
        ('Easy', 'Easy'),
        ('Medium', 'Medium'),
        ('Hard', 'Hard'),
    ]

    question_id = models.AutoField(primary_key=True, help_text="Unique ID for the question")
    title = models.CharField(max_length=255, help_text="Title of the question")
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_LEVELS, help_text="Difficulty level of the question")
    topics = models.TextField(help_text="Topics related to the question, comma-separated")
    description = models.TextField(help_text="Description of the problem statement")
    testcases = models.JSONField(help_text="Test cases with inputs and expected outputs in JSON format",default=list)
    constraints = models.TextField(help_text="Constraints for the problem")
    time_limit_per_test = models.CharField(max_length=10,help_text="Time limit for each testcase")
    note = models.TextField(help_text="Explanation for sample test cases or special Note about question",default="")
    def __str__(self):
        return f"{self.question_id}: {self.title}"