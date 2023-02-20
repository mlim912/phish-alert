import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import MouseOverPopover from './MouseOverPopover';
import ArrowBackIosRoundedIcon from '@material-ui/icons/KeyboardBackspace';
import { makeStyles } from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem'; 
import LocationOnIcon from '@material-ui/icons/LocationOn';
import PersonIcon from '@material-ui/icons/Person';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';

import Breadcrumbs from '@material-ui/core/Breadcrumbs'; 
import HomeIcon from '@material-ui/icons/Home';

//CSS
const useStyles = theme => ({
    wrapIcon: {
        marginBottom: '-.2em'
    },
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
      margin: theme.spacing(1),
    
  },
  ipButton: {
      margin: theme.spacing(1, 0),
      backgroundColor: '#508CDD',
      color: 'white'
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
});

class Sender extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          emailAdr: '',
          displayName: '',
          ipAdr: '',
          ipURL: '',
          senderScore: 0,
          ipScore: 0,
          nameSimilarity: '',
            totVal: 0, 
        };
    }

    componentDidMount(){
      this.getSender();
      this.internetHeaders();
    }

    //fetches sender's display name and email address
    getSender = async () => {
      
      var item = Office.context.mailbox.item.from;
      var item2 = Office.context.mailbox.item.sender;

      var a = item2.displayName;
      var b = item.emailAddress;

      this.setState({
        displayName: a,
        emailAdr: b,
      });

      //this.checkSpecificCharsInEmail(b);
      this.compareDisplayNameAndEmailAddress(a,b);
      //this.ipAPICall();
    }

    //Compares senders name with senders email address
    compareDisplayNameAndEmailAddress = async (senderName, senderEmail) => {
      var myProfile = Office.context.mailbox.userProfile.displayName;
      var text_1 = senderName;
      var text_2 = senderEmail;
      let self = this;
      var score = 0;
      var score_ip = 0;

      var lowerRes_1 = text_1.toLowerCase();
      var lowerRes_2 = text_2.toLowerCase();

     if(text_1 == myProfile){
        score = 100;
        score_ip = 100;
        self.setState({
          senderScore: score,
          nameSimilarity: 'Owner of email account',
          ipScore: score_ip,
          ipAdr: 'Myself',
        });
      }

      if(lowerRes_1.includes(".")){
        var removeDomain_1 = lowerRes_1.slice(0, lowerRes_1.lastIndexOf("."));
      }else{
        var removeDomain_1 = lowerRes_1;
      }

      //Normalization of displayname and email address into substrings in arrays.
      var removeDomain_2 = lowerRes_2.slice(0, lowerRes_2.lastIndexOf("."));

      var normalize_text_1 = removeDomain_1.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');
      var normalize_text_2 = removeDomain_2.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ');

      var ArrayRes_1 = normalize_text_1.split(" ");
      var ArrayRes_2 = normalize_text_2.split(" ");

      var filterArray_1 = ArrayRes_1.filter(word => word != "");
      var filterArray_2 = ArrayRes_2.filter(word => word != "");

      var string_1 = normalize_text_1.toString();
      var string_2 = normalize_text_2.toString();

      
      var domain = lowerRes_2.substring(lowerRes_2.lastIndexOf("@") + 1);
      var findDomain_2 = domain.substring(0, domain.lastIndexOf("."));
 
      for(var i = 0; i < filterArray_1.length; i++){
        if(string_2.includes(filterArray_1[i])){
          score += 30;
        }
        //Checks if email domain name is the same/parts of the senders displayname.
        //If it is true -> +30% on sender person
        if(findDomain_2.includes(filterArray_1[i])){
          score += 50;
        }
      }

      for(var j = 0; j < filterArray_2.length; j++){
        if(string_1.includes(filterArray_2[j])){
          score += 30;
        }
      }

      if(score >= 100){
        score = 100;
        self.setState({
          senderScore: score,
          nameSimilarity: 'Name found in email',
        })
      }else if(score < 100 && score > 75){
        self.setState({
          senderScore: score,
          nameSimilarity: 'Most parts of name found in email',
        })
      }else if(score <= 75 && score >= 50){
        self.setState({
          senderScore: score,
          nameSimilarity: 'Parts of name found in email',
        })
      }else if(score < 50 && score >= 25){
        self.setState({
          senderScore: score,
          nameSimilarity: 'Some similarity in name and email',
        })
      }else if(score < 25 && score > 0){
        self.setState({
          senderScore: score,
          nameSimilarity: 'Minimal similarity',
        })
      }else if(score == 0){
          self.setState({
            senderScore: score,
            nameSimilarity: 'No similarity',
          });
      }
      self.progBar(score, "bar_1");
      self.totEvaluation(score);
    }

    internetHeaders = async () => {
      let self = this;
      Office.context.mailbox.item.getAllInternetHeadersAsync(
        function(asyncResult) {
            if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
                  var dir = asyncResult.value;
                  var IP = "X-Sender-IP:";
                  var splitt = dir.split(IP).pop();
                  var r = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/;
                  var t = splitt.match(r);
                  var val = t[0];
                  var url = 'https://mxtoolbox.com/SuperTool.aspx?action=blacklist%3a' + val + '&run=toolpage';
                  self.setState({
                    ipAdr: val,
                      ipURL: url, 
                  });

                } else {
                    // Handle the error.
                    console.log(asyncResult.error.message);
                }
            });
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

      //Evaluation of the attributes percent scores
      totEvaluation = async (a) => {
        var value = a
        let self = this;
        var roundedScore = value.toFixed(0);
        self.setState({
          totVal: roundedScore,
        });
        self.progBar(roundedScore, "bar_4");
        self.props.onSenderScore(roundedScore);    
      }
    
    render(){
      const { classes } = this.props;
    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <IconButton className={classes.button} component={Link} to="/" size='small'>
                    <HomeIcon fontSize="inherit" />
                </IconButton>
                <Typography style={{ fontWeight: 'bold', m: 1, color: 'black' }} color="Black">Sender</Typography>
            </Breadcrumbs>


            <div className={classes.cards}> 
                <div className={classes.card}>
                    <div className={classes.flexContainer}>
                        <div>
                            <Typography variant="h6" component="h3">
                                Sender Trust Score
                            </Typography>
                        </div>
                        <div>
                            <MouseOverPopover tekst="The final percentage evaluation for the 'sender' section is determined primarily by two factors, the assessment of the sender persona alongside the assessment of the sender IP address. This percentage reflects the average of all contributing attributes."/>
                        </div>
                    </div>
                    <div className={classes.prosentOnBar}>
                        <div className={classes.bar} id="bar_4"><p><b>{this.state.totVal}%</b></p></div>
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
                    <TreeItem nodeId="1" label="Sender Persona" variant="h7" component="h7">
                            
                        <div className={classes.flexContainer}> 
                            <div>
                                <Typography variant="h6" component="h6">
                                    <PersonIcon className={classes.wrapIcon} /> Sender Persona
                                </Typography>
                            </div>
                            <div>
                                    <MouseOverPopover tekst="The sender persona is evaluated by comparing the sender's display name with their corresponding email address, the final score is calculated based on similarities between aspects of these two names (e.g., domain/words/name). Enterprise emails typically include identifying information and this can be an angle for determining legitimacy."/>
                            </div>
                        </div>
                         
                        <p>
                            Display Name:<br /> <b>{this.state.displayName}</b>
                        </p>
                        <p>
                            Email Adress:<br /> <b>{this.state.emailAdr}</b>
                        </p>
                                <p>Similarity:<br /> <b>{this.state.nameSimilarity}</b></p>
                                
                        </TreeItem>
                        
                        <TreeItem nodeId="5" label="Sender IP Address" variant="h7" component="h7">
                        <div className={classes.flexContainer}>
                            <div>
                                <Typography variant="h6" component="h6">
                                    <LocationOnIcon className={classes.wrapIcon } /> Sender's IP address
                                </Typography>
                            </div>
                            <div>
                                    <MouseOverPopover tekst="Use the button below to check whether or not the IP-address of the sender is blacklisted by the system; clicking the button will display a window which presents a number of databases that are cross-referenced with the sender IP-address. A detection of more than two listed red alerts is considered negative."/>
                            </div>
                        </div>
                        <p>Sender's IP: <b>{this.state.ipAdr}</b></p>


                        <Button variant="contained" className={classes.ipButton} href={this.state.ipURL} target="_blank">Check IP</Button>
                    </TreeItem>
                </TreeView> 
                   
            </div>
            
        </div>
         
        </div>
    );
    }
}
 

Sender.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Sender);