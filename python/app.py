from flask import Flask

app = Flask(app.py)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/add_text', methods=['POST'])
def add_text():
    user_text = request.form.get('user_text')
    if user_text:
        with open('text/index_text.txt', 'a') as file:
            file.write(user_text + '\n')
    return "Text added successfully!"

if __name__ == '__main__':
    app.run()
