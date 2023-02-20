import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button'; 
import spamWordData from './spamWordData.json';
import MouseOverPopover from './MouseOverPopover'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import ArrowBackIosRoundedIcon from '@material-ui/icons/ArrowBackIosRounded';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import TextFormatIcon from '@material-ui/icons/TextFormat'; 
import FindInPageIcon from '@material-ui/icons/FindInPage';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import { Link } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
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
  phishingWordList:{
    maxHeight: '10em',
    overflowY: 'auto',
  }
});

function handleClick(event) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
}


class Content extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          emailAdr: '',
          displayName: '',
          receiverScore: 0,
          dictScore: 0,
          encodeScore: 0,
          totalScore: '',
          nameCount: '',
          base64Encoding: '',
          spamWordCount: 0,
          list: [],
          totVal: 0,
        };
    }
    

    componentDidMount(){
      this.emailUserMatch();
      this.getEmailUsersName();
    }

    //Method that tries to find 
    emailUserMatch = async () => {
        var message = Office.context.mailbox.item;
        var user = Office.context.mailbox.userProfile.displayName;
        var normalized = user.toLowerCase();
        var nameArray = normalized.split(" ");
        let self = this;
        var count = 0;

        message.body.getAsync(Office.CoercionType.Text,
            function callback(result) {
              if (result.status === Office.AsyncResultStatus.Succeeded) {
                var bodyString = result.value.replace(/[\t\n\r]/gm,'');
                var eBodyString = bodyString.toLocaleLowerCase();

                for(var i = 0; i < nameArray.length; i++){
                  if(eBodyString.includes(nameArray[i])){
                    count++;
                  }
                }

                //Checks if email is sent by yourself, if so all values becomes 100%
                var item2 = Office.context.mailbox.item.sender.displayName;
                var no = " ";
                if(item2 == user){
                  self.receiverScore(10);
                  self.spamWordsCheck(no);
                  self.totEvaluation(100, 100, 100);
                  self.setState({
                    nameCount: 'enough',
                  });
                }
                else if(eBodyString.includes(normalized)){
                  self.receiverScore(10);
                  self.spamWordsCheck(eBodyString);
                  self.totEvaluation(self.state.receiverScore, self.state.dictScore, self.state.encodeScore);
                  self.setState({
                    nameCount: 'enough',
                  });
                }else{

                self.receiverScore(count);
                self.spamWordsCheck(eBodyString);
                self.totEvaluation(self.state.receiverScore, self.state.dictScore, self.state.encodeScore);
                }
              }else{
                console.log(result.error);
              }
        });
    }

    getEmailUsersName = async () => {
        var user = Office.context.mailbox.userProfile.displayName;
        this.setState({
            displayName: user,
        });
        return user;
    }

    //Checks if any words found in the email matches words in the spamWordData.json file
    spamWordsCheck = async (content) => {
      var json = spamWordData;
      var tempArray = [];
      var count = 0;
      let self = this;

      for(var i = 0; i < json.words.length; i++){
        if((content.match(new RegExp(json.words[i], "g")) || []).length){
          count++;
          tempArray.push(json.words[i]);
        }
      }

      self.setState({
        list: tempArray,
        spamWordCount: count,
      });
      self.dictionaryScore(count);
    }

    //Score calculations:

    //receiver score
    receiverScore = async (count) => {
      let self = this;
      if(count === 0){
        self.setState({
          receiverScore: 0,
          nameCount: count,
        });
      }else{
        var score = (count * 30);
        if(score >= 100){
          score = 100;
        }
        self.setState({
          receiverScore: score,
          nameCount: count,
        });
      }
      self.progBar(self.state.receiverScore, "bar_1");
    }

    //#phishing word score
    dictionaryScore = async (c) => {
      let self = this;
      var tot = 100;
      var num = (c * 2);
      var score = tot - num;
      var roundedScore = score.toFixed(2);
      self.setState({
        dictScore: roundedScore
      });
      self.progBar(self.state.dictScore, "bar_2");
    }

    //Giving colour to percent bar based on percent score.
    progBar = async (c, text) => {
      var elem = document.getElementById(text);
      var width = c;
      elem.style.width = "100%";
        if(width < 75){
            elem.style.backgroundColor = "#e91e63"; 
        } else if(width >= 75){
            elem.style.backgroundColor = "#009688";
      }
    }

    //Total evaluation percent score calculation
    totEvaluation = async (a,b) => {
      var one = parseInt(a, 10);
      var two = parseInt(b, 10);
      var value = ((one + two) / 2 );
      let self = this;
      var roundedScore = value.toFixed(0);
      self.setState({
        totVal: roundedScore,
      });
      self.progBar(roundedScore, "bar_4");
      var lang = self.state.totVal;
      self.props.onMessageScore(lang);
    }

    //Sends content score to MainList.js using props
    handleMesageScore = async () => {
      var lang = this.state.totVal;
      this.props.onMessageScore(lang);            
  }

    render(){
      const { classes } = this.props;
    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <IconButton className={classes.button} component={Link} to="/" size='small'>
                    <HomeIcon fontSize="inherit" />
                </IconButton> 
                <Typography style={{ fontWeight: 'bold', m: 1, color: 'black' }}  color="Black">Content</Typography>
            </Breadcrumbs>

          <div className={classes.cards}>
                <div className={classes.card}>
                    
                    <div className={classes.flexContainer}>
                        <div>
                            <Typography variant="h6" component="h3">
                                Content Trust Score
                            </Typography>
                        </div>
                        <div>
                            <MouseOverPopover tekst="The final percentage evaluation for the 'content' section is determined primarily by two factors, the assessment of the receiver relation alongside an evaluation of included text. This percentage reflects the average of all contributing attributes."/>
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
                        <TreeItem nodeId="1" label="Receiver">
                             
                        <div className={classes.flexContainer}>
                            <div>
                                <Typography variant="h7" component="h7">
                                    <AccountBoxIcon className={classes.wrapIcon} />  Your name
                                </Typography>
                            </div>
                            <div>
                                    <MouseOverPopover tekst="Any relation to the email receiver will be analysed and considered in the final evaluation of the email content. Typically phishing emails do not have any direct reference to the receiver so this factor will be flagged as a consideration."/>
                            </div>
                        </div>
                         
                        <p>
                            Surname or last name of <b>{this.state.displayName}</b>, was metioned <b>{this.state.nameCount}</b> time in this email.
                        </p>
                    </TreeItem>
                    <TreeItem nodeId="5" label="Phishing Words">
                        <div className={classes.flexContainer}>
                            <div>
                                <Typography variant="h7" component="h7">
                                    <FindInPageIcon className={classes.wrapIcon} />  We found <b>{this.state.spamWordCount}</b> phishing words.
                                </Typography>
                            </div>
                            <div>
                                    <MouseOverPopover className={classes.wrapIcon} tekst="It is not uncommon for emails linked with phishing attacks to contain certain inflammatory vocabulary related to urgency, fear, username/password changes or economic loss/gain. The ‘Phish Alert’ security plugin contains a system for identifying this contentious language; this identification will impact the final percentage evaluation."/>
                            </div>
                        </div>
                        <p>Phishing words found:</p>
                        <div className={classes.phishingWordList}>
                            {this.state.list.map(item => (
                                <p key={item}>{item}</p>
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

Content.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Content);