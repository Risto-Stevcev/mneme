# Mneme

**Mneme** is a new and elegant note-taking format with a web editor/viewer. The web app edits and views a new type of notes format called a *mneme* file. 

A *mneme* file is a combination file format. The file format's basic structure comprises of a **JSON** *object*. Each **key** in the key/value pair refers to a *topic* name, and the **value** is either a new set of key/value pairs (indicating a *subnode*), or a *string* that's formatted in **markdown** syntax.

The viewer creates a tree of *topics* from the *mneme* file, and the bottom-most nodes are always *strings* in **markdown** format containing more detailed information about the topic/subtopic. The editor/viewer makes it easy to edit and view the *mneme* file.

Mneme is named after **Mneme**, the Muse of Memory. The tree-like structure of the file format makes it easy to divide up concepts into subconcepts as small as is necessary. The markdown format of the text makes it easy to quickly add formatting like bold, italics, code, or lists. The powerful combination of a JSON tree with markdown text makes it easy to maintain, organize and manipulate all of your notes!

View on PyPI: https://pypi.python.org/pypi/mneme/ 

Here is an animated demo of how the web app looks:

![Mneme demo](https://raw.githubusercontent.com/Risto-Stevcev/flask-mneme/master/mneme/demo.gif)


## Instructions

** Note: ** *Using the Heroku/MongoDB/Flask web stack is optional for using the mneme file format. The file format is just a representation structure that can be used by anything that can handle JSON and markdown formats.*

1. Install **Mneme**.  
   ``pip install --user mneme``  
   
2. Test your installation.  
   Start the server by typing ``mneme runserver`` and go to ``localhost:5000`` in your browser. It should return a ``404 error`` because you haven't registered a *mongodb database* yet.  

3. Create a **MongoHQ** account.  
  Go to [http://www.mongohq.com/](http://www.mongohq.com/), click ``Sign Up`` and follow the steps to register.  
  
4. Add a new **MongoHQ** database for *mneme*.  
   1. Create a new **MongoHQ** database using the free *512MB sandbox* version (or paid if you want/need it).  
   2. Create a new user to access the database.  
      Go to Databases->(*your new mneme database*)->Admin->Users at the MongoHQ website dashboard, and click the ``Add User`` button to add a new user.  
   3. Test your MongoHQ database.  
      1. Go to Databases->(*your new mneme database*)->Admin->Overview at the MongoHQ website dashboard and grab the line of code that says ``Mongo Console``.  
      2. Replace ``<user>`` and ``<password>`` with the username and password you created for your database earlier, and run it in the command line. You should now be connected to your new database!  

5. Register your **MongoHQ** database with *mneme*.  
  1. Locate the **Mongo URI** in Databases->(*your new mneme database*)->Admin->Overview and identify the host, port and database.  
     Ex: ``mongodb://<user>:<password>@oceanic.mongohq.com:10052/mneme``, *oceanic.mongohq.com* is the hostname, *10052* is the port, *mneme* is the database.  
  2. Run the *mneme* ``register`` command.  
     Fill in the options with the database username/password you created earlier at MongoHQ, and the parameters you identified from the Mongo URI.  
     Ex: ``mneme register --db mneme --username myusername --password mypassword --host oceanic.mongohq.com --port 10052``  

6. Add or modify an *authorized user*.  
   Run something like ``mneme authorize --user hello --password world``, which in this case would authorize user ``hello`` with the password ``world`` to use the *mneme* web app.

7. Test out **Mneme**!  
   Run ``mneme runserver`` again and go to ``localhost:5000``. Then log in with your *authorized user* credentials and start playing around with mneme.  
   The interface is self-explanatory. You can use ``CTRL-S`` when viewing/editing a particular *mneme* file to quickly save client-side. The file isn't saved on the server-side until you click ``Save Mneme``, which will redirect you to the main page with all of the *mnemes* listed.


### Shortcuts

* *Tab* in the editing window will indent the selected text by 4 spaces (*for multi-line code*).  
* *Shift-tab* in the editing window will un-indent the selected text by 4 spaces (*for multi-line code*).  
* *Ctrl-left* when viewing a particular mneme file will go into *View mode*.  
* *Ctrl-right* when viewing a particular mneme file will go into *Edit mode*.  


### Exporting

After you've written a bunch of notes using *mneme*, you might want to keep the files locally in their native JSON file format for reference or as a backup. MongoDB preserves the *mneme* files in their native JSON format automatically. Here's how to do a simple export using the same credentials you used in the steps to get it set up:

    mongoexport --host (hostname:port) -u <user> -p<pass> --db <db> --collection <collection> --out <json output file>

    Example:
    mongoexport --host oceanic.mongohq.com:10052 -u mnememaster -ppasswd --db mnemedb --collection mneme --out mnemes.json




## Heroku

You probably want to be able to use *mneme* as a web app so you can edit notes on your mobile phone or tablet wherever you are. It also opens the door to modify the web app in the ways you want it to work. Here are the steps to get *mneme* up and running with Heroku.

1. Create a **Heroku** account.  

2. Login to Heroku.  
   Run ``heroku login`` in the terminal and type in your account credentials.  
   
3. Clone the **Mneme** source code.
   Run ``git clone https://github.com/Risto-Stevcev/flask-mneme.git`` in the terminal and the directory you want it to install into.
   
4. Create a *virtualenv* environment.  
   In the clone directory, you should see several python files such as ``manage.py``, and folders like ``templates`` and ``logs``. Create a *virtualenv* environment in this directory and name it ``venv``. Type:  
  ``virtualenv venv`` 

5. Start the *virtualenv* environment and install the python dependencies.  
  1. Start the environment with this command:
     ``source venv/bin/activate``  
     You should see ``(venv)`` next to your shell prompt indicating that it's active.  
  2. Install all of the missing dependencies listed in the ``dependencies.txt`` file in the cloned mneme folder.  
    Ex: ``pip install Flask gunicorn`` as a bare minimum. You'll also need the rest, such as mongodb's dependencies.  

6. Test that the ``Procfile`` works.  
   Run ``foreman start`` in the directory that ``Procfile`` lives in. You might need to install foreman if you haven't already for this step.
   
7. Deploy the application to Heroku.  
  1. Create a new Heroku app by running the command:  
     ``heroku create``  
     The command should have added a remote repository called ``heroku``. Check by typing ``git remote -v``.
  2. Upload your public key to Heroku if you haven't already:  
     ``heroku keys:add ~/.ssh/id_rsa.pub``  
    If you don't have a public key (``ls ~/.ssh/id_rsa.pub`` returns nothing), Heroku will prompt you to add one automatically. You can use:  
    ``heroku keys:add``  
  3. Push the files upstream to Heroku:  
    ``git push heroku master``

8. Test your Heroku app by going to the link generated by Heroku for your app. See Heroku's [getting started with python](https://devcenter.heroku.com/articles/getting-started-with-python) for reference and further reading.
   
That's it! I hope this was easy to set up, and I hope you enjoy using **Mneme**! If you have any feature requests, please submit an issue on the project GitHub page with the label ``enhancement``, or ``bug`` if you happen to find bugs. Or submit a pull request if you're interested in contributing.
