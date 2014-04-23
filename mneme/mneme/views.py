from flask import Blueprint, request, redirect, render_template, url_for
from flask.ext.mongoengine.wtf import model_form
from flask.views import MethodView
from mneme.models import Mneme
from mneme import app
from mneme.auth import requires_auth
import json


mnemes = Blueprint('mnemes', __name__, template_folder='templates')


class ListView(MethodView):
    decorators = [requires_auth]

    def get(self):
        mnemes = Mneme.objects.all()
        for mneme in mnemes:
            mneme.body = str(mneme.body)
        return render_template('mnemes/list.html', mnemes=mnemes)

    def post(self):
        mnemes = Mneme.objects.all()
        mneme = Mneme.objects.filter(title=request.form['mnemetitle'])
        
        message = None
        if mneme and (not request.form.get('mnemedelete') or request.form.get('mnemedelete') != "true"):
            mneme = mneme[0]
            mneme_body = json.loads(request.form['mnemebody'])
            mneme.body = mneme_body
            mneme.save()
            message = "Mneme '" + mneme.title + "' saved."

        elif mneme and request.form.get('mnemedelete') == "true":
            mneme = mneme[0]
            mneme.delete()
            message = "Mneme '" + mneme.title + "' deleted."

        else:
            mneme = Mneme( title=request.form['mnemetitle'],
                           body={'title': request.form['mnemetitle'],
                                 'body': []} )
            mneme.save()
            message = "Mneme '" + mneme.title + "' created."

        return render_template('mnemes/list.html', message=message, mnemes=mnemes)


class DetailView(MethodView):
    decorators = [requires_auth]

    def get(self, title):
        mneme_object = Mneme.objects.get_or_404(title=title)
        mneme_object['body'] = json.dumps(mneme_object['body'])
        return render_template('mnemes/detail.html', mneme=mneme_object)


mnemes.add_url_rule('/', view_func=ListView.as_view('list'))
mnemes.add_url_rule('/<title>/', view_func=DetailView.as_view('detail'))
