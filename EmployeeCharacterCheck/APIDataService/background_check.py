import pandas
import nltk
from sklearn import tree
from sklearn.tree import DecisionTreeClassifier
from sklearn.impute import SimpleImputer
from nltk.sentiment import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk import ne_chunk, pos_tag
import requests

api = "enter your api key"

def extract_news(name,location):
    try:
        url = "http://newsapi.org/v2/everything?q=" + name +"&apiKey=" + api
        new = requests.get(url).json()
        crime_keywords = ['Murder', 'Robbery', 'Theft', 'Burglary', 'Arson', 'Fraud', 'Embezzlement', 'Extortion', 'Kidnapping', 'Homicide', 'Assault', 'Battery', 'Forgery', 'Cybercrime', 'Identity theft', 'Counterfeiting', 'Drug trafficking', 'Money laundering', 'Racketeering', 'Prostitution', 'Human trafficking', 'Domestic violence', 'Stalking', 'Harassment', 'Vandalism', 'Carjacking', 'Grand larceny', 'Petit larceny', 'Shoplifting', 'Joyriding', 'Hit and run', 'Reckless driving', 'Driving under the influence (DUI)', 'Breaking and entering', 'White-collar crime', 'Organized crime', 'Gang violence', 'Assault with a deadly weapon', 'Arson for profit', 'Bribery', 'Insider trading', 'Hacking', 'Phishing', 'Drug possession', 'Drug manufacturing', 'Drug distribution', 'Cyberstalking', 'Harassment by electronic means', 'Child pornography', 'Child molestation', 'Sexual assault', 'Rape', 'Indecent exposure', 'Prostitution ring', 'Solicitation', 'Fraudulent investment schemes', 'Ponzi schemes', 'Pyramid schemes', 'Insider trading', 'Money market fraud', 'Securities fraud', 'Wire fraud', 'Mail fraud', 'Bank fraud', 'Tax evasion', 'Public corruption', 'Embezzlement of public funds', 'Kickbacks', 'Campaign finance violations', 'False advertising', 'False billing', 'Consumer fraud', 'Healthcare fraud', 'Medicare fraud', 'Medicaid fraud', 'Insurance fraud', 'Disability fraud', 'Workers compensation fraud', 'Welfare fraud', 'Embezzlement of funds', 'Intellectual property theft', 'Copyright infringement', 'Trademark infringement', 'Patent infringement', 'Hacking', 'Data theft', 'Identity theft', 'Credit card fraud', 'Counterfeiting', 'Forgery', 'Smuggling', 'Human smuggling', 'Arms smuggling', 'Money laundering', 'Tax evasion', 'Insider trading', 'Perjury', 'Obstruction of justice', 'Witness tampering', 'Jury tampering', 'Failure to appear', 'Contempt of court', 'Disorderly conduct', 'Public intoxication', 'Possession of illegal drugs', 'Possession of drug paraphernalia', 'Selling illegal drugs', 'Manufacturing illegal drugs', 'Trafficking illegal drugs', 'Assault with a deadly weapon', 'Battery', 'Aggravated assault', 'Aggravated battery', 'Domestic violence', 'Child abuse', 'Elder abuse', 'Hate crime', 'Animal cruelty', 'False imprisonment', 'Kidnapping', 'Human trafficking', 'Carjacking', 'Robbery', 'Armed robbery', 'Burglary', 'Home invasion', 'Vandalism', 'Graffiti', 'Arson', 'Terroristic threats', 'Cyberbullying', 'Online harassment', 'Sexting', 'Revenge porn', 'Child abduction', 'Child exploitation', 'Child endangerment', 'Sextortion', 'Child grooming', 'Child trafficking', 'Sexual exploitation of minors', 'Child prostitution', 'Child labor exploitation', 'Child soldiering', 'Forced labor', 'Bonded labor', 'Human rights violations', 'Police brutality', 'Excessive use of force', 'False arrest']
        
        articles = new['articles']
        news = []
        for article in articles:
            if(any(keyword in article['description'] for keyword in crime_keywords)):
                news.append(article['description'].replace("'"," "))
        if(len(news) > 0):
            return(Check_criminal_info("".join(news),name,location)) 
        else:
            return 20
    except requests.exceptions.ConnectionError as e:
        return "Network Error"

def Check_criminal_info(news,name,location):
# Initialize the sentiment analyzer
    try:
        sid = SentimentIntensityAnalyzer()

    # # Use NER to identify the names of people mentioned in the text
        locations = set()
        person_names = set()
        for sentence in sent_tokenize(news):
            chunked = ne_chunk(pos_tag(word_tokenize(sentence)))
            for chunk in chunked:
                if hasattr(chunk, 'label') and (chunk.label() == 'PERSON' or chunk.label() == 'GEB'):
                    person_names.add(' '.join(c[0] for c in chunk))
                elif hasattr(chunk, 'label') and (chunk.label() == 'GPE' or chunk.label() == 'LOCATION'):
                    locations.add(' '.join(c[0] for c in chunk))

    # # Analyze the sentiment of sentences or phrases in which the person names appear
        sentiment_scores = {name: [] for name in person_names}
        for name in person_names:
            for sentence in sent_tokenize(news):
                if name in sentence:
                    sentiment_scores[name].append(sid.polarity_scores(sentence)['compound'])

    # # Rank the person names by their average sentiment score
        ranked_names = sorted(person_names, key=lambda name: sum(sentiment_scores[name])/len(sentiment_scores[name]), reverse=True)
        names = []
        for name in ranked_names:
            if sum(sentiment_scores[name])/len(sentiment_scores[name]) < 0:
                names.append(name)
        return validate_details(names.extend(locations),name,location)
    except ZeroDivisionError :
        return validate_details([],name.location)

def validate_details(names,name,address):
    first_name = 0
    middle_name = 1
    last_name = 0
    location = 0
    culprit = 0
    n = name.split()
    if(len(names) > 0):
        if(address in names):
            location = 1
        if(len(n) == 1):
            if(name in names):
                first_name = 1
                last_name = 1
                culprit = 1
        elif(len(n) ==2):
            if(n[0] in names):
                first_name = 1
                culprit = 1
            if(n[1] in names):
                last_name = 1
                culprit = 1
        else:
            if(n[0] in names):
                first_name = 1
                culprit = 1
            if(n[1] not in names):
                middle_name = 0
                culprit = 1
            if(n[2] in names):
                last_name = 1
                culprit = 1
    result = []
    result.append(first_name)
    result.append(middle_name)
    result.append(last_name)
    result.append(location)
    result.append(culprit)
    return(decision(result)) #[0,1,1,0,1]
     
def decision(input):

    df = pandas.read_csv(r"data1.csv")

    # d = {'UK': 0, 'USA': 1, 'N': 2}
    # df['Nationality'] = df['Nationality'].map(d)
    # d = {'YES': 1, 'NO': 0}
    # df['Go'] = df['Go'].map(d)

    features = ['FirstName','MiddleName', 'LastName', 'Location', 'Culprit']
    X = df[features]
    y = df['Percentage']

    imputer = SimpleImputer(strategy='mean')
    X = imputer.fit_transform(X)

    dtree = DecisionTreeClassifier()
    dtree = dtree.fit(X, y)

    #[0, 1, 1, 1] = input

    result=dtree.predict([input])[0]

    return 20-(int(result)/100)*20


#courtapi
def court_check(name):
    try:
        main_url = "http://www.aironline.in/visitorAutoSearchResult.html?maxRows=20&term=" + name + "&Nature_Of_Record"+"=&solrCoreName="
        news = requests.get(main_url).json()
        count = 0
        for i in news:
            if i['id'] == "PRIMARY_RESPONDENT" and i['value'] == name:
                count += 1
        if count == 0:
            return 40
        elif count == 1:
            return 20
            
        elif count == 2:
            return 10
            
        elif count == 3:
            return 5.2
            
        elif count == 4:
            return 2.3
           
        elif count == 5:
            return 1.6
            
        elif count == 6:
            return 1.2
            
        elif count == 7:
            return 0.8
            
        elif count == 8:
            return 0.4
            
        elif count >= 9:
            return 0
            
    except requests.exceptions.ConnectionError as e:
        return "Network Error"
