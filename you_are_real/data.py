""" Database access """

from cgitb import reset
from psycopg2 import connect

class Database:
    """ Provides accessin to question/answer database """
    def __init__(self, conn_str):
        self.connection = connect(conn_str)
        self.connection.autocommit = True

    def _get_cursor(self):
        return self.connection.cursor()

    def _get_all(self, table, column):
        with self._get_cursor() as cursor:
            cursor.execute("SELECT %(column)s FROM %(table)s", {"table": table, "column": column})
            return cursor.fetchall()

    def add_answer(self, user_id, question_id, answer_text):
        """ Record a new answer """
        with self._get_cursor() as cursor:
            params = {
                "answer": answer_text,
                "user_id": user_id,
                "question_id": question_id
            }
            cursor.execute("INSERT INTO QuestionsHaveAnswers (UserId, QuestionId, Answer)" \
                "VALUES (%(user_id)s, %(question_id)s, %(answer)s)", params)

    def get_user_id(self, name):
        """ Get a numeric id for the specified user """
        with self._get_cursor() as cursor:
            cursor.execute("SELECT Id FROM Users WHERE Name = %(name)s", {"name": name})
            result =  cursor.fetchone()
            return result[0] if result else None

    def create_user(self, name):
        """ Create a new user and return its id """
        with self._get_cursor() as cursor:
            cursor.execute("INSERT INTO Users (Name) VALUES (%(name)s)", {"name": name})
            cursor.execute("SELECT Id FROM Users WHERE Name = %(name)s", {"name": name})
            return cursor.fetchone()[0]

    def get_question(self, question_id):
        """ Get the question with the corresponding id """
        with self._get_cursor() as cursor:
            cursor.execute(
                """
                    SELECT Question
                        FROM Questions
                        WHERE
                            Id = %(question_id)s
                """,
                { "question_id": question_id }
            )
            return cursor.fetchone()[0]

    def get_random_question(self, user_id):
        """
            Return a tuple containing the id and text of a new random question for the
            given user, or None if all questions are already answered
        """
        with self._get_cursor() as cursor:
            cursor.execute(
                """
                    SELECT q.Id, q.Question
                        FROM Questions q
                        WHERE
                            NOT EXISTS (
                                SELECT qha.Id
                                FROM QuestionsHaveAnswers qha
                                WHERE
                                    qha.QuestionId = q.Id AND
                                    qha.UserId = %(user_id)s
                            ) AND
                            q.Id > 1
                        ORDER BY RANDOM()
                        LIMIT 1
                """,
                { "user_id": user_id }
            )
            result = cursor.fetchone()
            return result if result else (None, None)
