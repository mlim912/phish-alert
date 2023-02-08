import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import MouseOverPopover from './MouseOverPopover';
import ArrowBackIosRoundedIcon from '@material-ui/icons/KeyboardBackspace';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';

//Cloudmersive 
var CloudmersiveVirusApiClient = require('cloudmersive-virus-api-client');

//CSS
const useStyles = theme => ({
  root: {
    paddingLeft: '1em',
  },
  card: {
    padding: theme.spacing(2, 2),
    maxWidth: '85%',
    marginTop: '.6em',
    backgroundColor: 'WhiteSmoke',
      wordBreak: 'break-all',
      borderRadius: 5
  },
  cards:{
    maxHeight: '40em',
    overflowY: 'auto',
    paddingLeft: '.1em',
  },
  button: {
    margin: theme.spacing(1, 0),
  },
  popover: {
    pointerEvents: 'none',
  },
    flexContainer: {
        display: 'flex',
        justifyContent: 'left',
        justifyContent: 'space-between',
        marginTop: '1em',
        maxWidth: '90%'
    },
  prosentOnBar:{
    width: '90%',
    backgroundColor: 'lightgrey',
    display: 'block',
    textAlign: 'center',
    lineHeight: '30px',
    color: 'white',
  },
  bar:{
    width: '1%',
    height: '30px',
      backgroundColor: 'green',
      borderRadius: 3
  },
  fileList:{
    maxHeight: '8em',
    overflowY: 'auto',
    marginTop: '-.5em',
  }
});

class Attachments extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          nameOfFilesArray: [],
          numFiles: 0,
          attachmentScore: 0,
          totVal: 0,
        };
    }

    componentDidMount(){
      this.getAttachmentsInfo();
    }

    //fetches email attachments through 
    getAttachmentsInfo = async () => {   
      var item = Office.context.mailbox.item;
      var fileNameArray = [];
      var numberOfFiles = 0;
      var score = 100;
      let self = this;

      //checks if email contains attachments
      if(item.attachments.length < 1){ 
        self.setState({
          attachmentScore: score,
        });
      }

        if (item.attachments.length >= 1) {
          self.setState({
            attachmentScore: score,
          });
            //displays names of files
            for (var i = 0; i < item.attachments.length; i++) {
            var attachment = item.attachments[i];
            if(!attachment.isInline){
              numberOfFiles++;
              fileNameArray.push(attachment.name);
                }
               
                var CloudmersiveVirusApiClient = require('cloudmersive-virus-api-client');

                var defaultClient = CloudmersiveVirusApiClient.ApiClient.instance;

                // Configure API key authorization: Apikey
                var Apikey = defaultClient.authentications['Apikey'];
                Apikey.apiKey = "2c2b2abe-4a5d-4719-bb4e-c71e25f8eb34"
                // Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
                //Apikey.apiKeyPrefix['Apikey'] = "Token"
                 
                var api = new CloudmersiveVirusApiClient.ScanApi()

                var inputFile = attachment; // {File} Input file to perform the operation on.
                 
                var callback = function (error, data, response) {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log('API called successfully. Returned data: ' + data); 
                    }
                };
                var xhr = (api.scanFile(inputFile, callback)).xhr;
                var result = true;
                xhr.onload = () => {
                    const data = xhr.responseText

                    // log response
                    result = JSON.parse(data).CleanResult;
                }

                if (result == false) {
                    score = 0;
                }


            }
        }
      
      self.setState({ 
        nameOfFilesArray: fileNameArray,
        numFiles: numberOfFiles,
      });

      self.progBar(score, "bar_1");
      self.totEvaluation(score);
    }

    //Giving colour to percent bar based on percent score.
    progBar = async (c, text) => {
        var elem = document.getElementById(text);
        var width = c;
      elem.style.width = "100%";
          if(width <= 75){
              elem.style.backgroundColor = "#e91e63"; 
          } else if(width > 75){
              elem.style.backgroundColor = "#009688";
        }
      }

      //Total evaluation percent score calculation
      totEvaluation = async (a) => {
        var value = a;
        let self = this;
        var roundedScore = value.toFixed(0);
        self.setState({
          totVal: roundedScore,
        });
        self.progBar(roundedScore, "bar_2");
        console.log(roundedScore);
        self.props.onAttachmentScore(roundedScore);    
      }
    
    render(){
      const { classes } = this.props;
    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <IconButton className={classes.button} component={Link} to="/" size='small'>
                    <HomeIcon fontSize="inherit" />
                </IconButton>
                <Typography style={{ fontWeight: 'bold', m: 1, color: 'black' }} color="Black">Attachments</Typography>
            </Breadcrumbs>
            <div className={classes.cards}>
 
                
                <div className={classes.card}>
                    <div className={classes.flexContainer}>
                        <div>
                            <Typography variant="h6" component="h6" >
                                Attachments Trust <br/>Score
                            </Typography>
                        </div>
                        <div>
                            <MouseOverPopover tekst="The final percentage trust score for the 'attachments' section is determined by the assessment of the content contained within the emails attachments."/>
                        </div>
                    </div>

                    <div className={classes.prosentOnBar}>
                        <div className={classes.bar} id="bar_1"><p><b>{this.state.attachmentScore}%</b></p></div>
                    </div> 
                </div>
                <div className={classes.card}>
                    <Typography variant="h6" component="h6">
                        Here's why:
                    </Typography>
                <TreeView
                    className={classes.root}
                    defaultCollapseIcon={<ExpandMoreIcon />}
                    defaultExpandIcon={<ChevronRightIcon />}
                >
                    <TreeItem nodeId="1" label="Attachments">
                        <div className={classes.flexContainer}>
                            <div>
                                <Typography variant="h6" component="h3">
                                    Attached files
                                </Typography>
                            </div>
                            <div>
                                <MouseOverPopover tekst="Displays all files that are attached to the email. If any of the files scanned is found to be malicious, an immediate score of <b>0</b> will be given to this attribute." />
                            </div>
                        </div> 
                        <p>Number of files: <b>{this.state.numFiles}</b></p>
                        <p>File names:</p>
                        <div className={classes.fileList}>
                            {this.state.nameOfFilesArray.map(item => (
                                <ul key={item}><b>{item}</b></ul>
                            ))}
                        </div>
                    </TreeItem>
                    
                </TreeView>
                </div>
        
         
        
        </div>
            
        </div>
    );
    }
}

Attachments.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Attachments);