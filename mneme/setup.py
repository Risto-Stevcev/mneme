from setuptools import setup, find_packages


setup(
    name='mneme',
    version='0.201',
    license='BSD',
    author='Risto Stevcev',
    author_email='risto1@gmail.com',
    url='https://github.com/Risto-Stevcev/flask-mneme',
    description="A powerful note-taking format with a web viewer/editor.",
    long_description=open("README.md","r").read(),
    packages=find_packages(),
    install_requires=['Flask==0.10.1', 
                      'Flask-Script==0.6.7', 
                      'Flask-WTF==0.9.5', 
                      'Jinja2==2.7.2', 
                      'MarkupSafe==0.21', 
                      'WTForms==1.0.5', 
                      'Werkzeug==0.15.3', 
                      'flask-mongoengine==0.7.0', 
                      'gunicorn==18.0', 
                      'itsdangerous==0.24', 
                      'mongoengine==0.8.7', 
                      'pymongo==2.7', 
                      'wsgiref==0.1.2'],
    entry_points = {
        'console_scripts': ['mneme=mneme.manage:main'],
    },
    keywords = "note notes markdown json viewer editor text organizer",
    include_package_data=True,
    package_data={'' : ['*.svg', '*.jpg', '*.js', '*.css', '*.html', '*.txt']},
    classifiers=[
        'Development Status :: 3 - Alpha',
        'Environment :: Web Environment',
        'Framework :: Flask',
        'Intended Audience :: Customer Service',
        'Intended Audience :: Developers',
        'Intended Audience :: Education',
        'Intended Audience :: End Users/Desktop',
        'Intended Audience :: Other Audience',
        'Intended Audience :: Science/Research',
        'License :: OSI Approved :: BSD License',
        'Natural Language :: English',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 2.7',
        'Topic :: Documentation',
        'Topic :: Education',
        'Topic :: Internet',
        'Topic :: Scientific/Engineering',
        'Topic :: Text Editors',
        'Topic :: Text Editors :: Documentation',
        'Topic :: Text Editors :: Text Processing',
        'Topic :: Text Processing :: Markup',
        'Topic :: Utilities',
        ],
)
