import datetime as dt

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, literal_column

from flask import Flask, jsonify, render_template


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///datasets/belly_button_biodiversity.sqlite", echo=False)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)


# create refernces to tables
Samples = Base.classes.samples
OTU = Base.classes.otu
Metadata = Base.classes.samples_metadata


# Create session (link) from Python to the DB
session = Session(engine)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

# returns dashboard homepage
@app.route("/")
def index():
    """Return Homepage"""
    return (render_template("index.html"))

# renames list of sample names
@app.route("/names")
def names():
    results = session.query(Samples).first()

    names = [];
    for r in results.__dict__.keys():
        if r.startswith("BB_"):
            names.append(r);

    # names = [r for r in results.__dict__.keys()]
    # names.sort(key=lambda x:int(x.split()[-1]))
    names.sort(key = lambda x: int(x.split('_')[1]))
    return jsonify(names)


# return the list of OTU descriptions
@app.route("/otu")
@app.route("/otu/<counter>")
def otudescriptions(counter=None):
# force 0 if counter is not passed. 
    if (not counter):
        counter = 0

    if counter == 0:
        results = session.query(OTU.lowest_taxonomic_unit_found).all()
    else:
        results = session.query(OTU.lowest_taxonomic_unit_found).limit(counter).all()

    otuDesc = [r[0] for r in results]
    return jsonify(otuDesc)


# return metadata for a given sample
@app.route("/metadata/<sample>")
def metadata_samples(sample):
    # sample = 'BB_940'
    results = session.query(Metadata) \
        .filter(Metadata.SAMPLEID==sample.split('_')[1]).all()
    for r in results:
        data = {
            "AGE": r.AGE,
            "BBTYPE": r.BBTYPE,
            "ETHNICITY": r.ETHNICITY,
            "GENDER": r.GENDER,
            "LOCATION": r.LOCATION,
            "SAMPLEID": r.SAMPLEID
        }
    return jsonify(data)


# return integer value for weekly washing frequency
@app.route("/wfreq/<sample>")
def wfreq(sample):
    results = session.query(Metadata.SAMPLEID, Metadata.WFREQ) \
        .filter(Metadata.SAMPLEID==sample.split('_')[1]).first()[1]    

    return jsonify(results)


# return otu ids and sample values for a given sample
@app.route("/samples/<sample>")
@app.route("/samples/<sample>/<counter>")
def sample_values(sample,counter=None):
    # sample = 'BB_1298'

    # force 0 if counter is not passed. 
    if (not counter):
        counter = 0

    print(counter)

    # if counter == 0:
    #     results = session.query(Samples.otu_id, literal_column(sample), OTU.lowest_taxonomic_unit_found) \
    #         .join(OTU, Samples.otu_id==OTU.otu_id) \
    #         .order_by(literal_column(sample).desc()).all()
    # else:        
    #     results = session.query(Samples.otu_id, literal_column(sample), OTU.lowest_taxonomic_unit_found) \
    #         .join(OTU, Samples.otu_id==OTU.otu_id) \
    #         .order_by(literal_column(sample).desc()).limit(counter).all()

    if counter == 0:
        results = session.query(Samples.otu_id, literal_column(sample)) \
            .order_by(literal_column(sample).desc()).all()        
    else:        
        results = session.query(Samples.otu_id, literal_column(sample)) \
            .order_by(literal_column(sample).desc()).limit(counter).all()

        
    otuIDs = [r[0] for r in results]    
    # otuDescriptions = [r[2] for r in results]
    sample_results = [r[1] for r in results]

    data = {
        "otu_ids": otuIDs,
        # "otu_desc": otuDescriptions,
        "sample_values": sample_results
    }
    return jsonify(data)



if __name__ == '__main__':
    app.jinja_env.auto_reload = True
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True)


