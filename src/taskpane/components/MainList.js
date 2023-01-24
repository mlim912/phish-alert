import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CardInfoList from "./CardInfoList"
import MouseOverPopover from './MouseOverPopover' 
import Content from "./Content";
import Sender from "./Sender";
import Links from "./Links";
import Attachment from "./Attachments";
import Button from '@material-ui/core/Button'; 
import { Link } from 'react-router-dom';    
import SecurityIcon from '@material-ui/icons/Security'; 
import Alert from '@material-ui/lab/Alert';
 

function onCurrentQuarterDeactivated() {
    Office.context.ui.closeContainer();
}
 

//CSS
const useStyles = theme => ({
    wrapIcon: {
        marginBottom: '-.2em'
    },
    root: {
        paddingLeft: '1em', 
        overflow: 'hidden',
    },
    card: {
        maxWidth: '95%',
        marginTop: '.5em'
    },
    cards: {
        overflowY: 'scroll',
        maxHeight: '18em',
    },
    paper: {
        maxWidth: '85%',
        padding: '1em',
        marginTop: '.5em',
        marginBottom: '.5em',
        backgroundColor: '#eeeeee', 
        "&:hover": {
            backgroundColor: 'white'
        },
    },
     
    
  checkbox: {
    marginLeft: '4.8em',
  },
  prosentOnBar:{
    width: '100%',
    backgroundColor: 'lightgrey',
    display: 'block',
    textAlign: 'center',
    lineHeight: '20px',
      color: 'white', 
      borderRadius: 3
  },
  totalProsentOnBar:{
    width: '80%',
    backgroundColor: 'lightgrey',
    display: 'block',
    textAlign: 'center',
    lineHeight: '20px',
      color: 'white', 
      borderRadius: 3
  },
  safetyBar:{
    width: '100%',
    backgroundColor: 'lightgrey',
    lineHeight: '30px',
    color: 'white',
      textAlign: 'center',
      borderRadius: 3
  },
  bar:{
    width: '1%',
      height: '25px',
      borderRadius:3
  },
  cont:{
    borderTop: '1.5px solid black',
      marginTop: '.5em',
      maxWidth: '100%',
      padding: '1em',
      marginTop: '.5em',
  },
  box1:{
    display: 'inline-block',
    width: '45%',
    padding: 'none',
    marginBottom: '.1em',
    marginTop: '.1em', 
    }, 
  box2:{
    display: 'inline-block',
    width: '45%',
    paddingTop: 'none',
    marginBottom: '-.1em',
      marginTop: '-.8em', 
    },
    box3: {
        display: 'inline-block',
        width: '50%',
        paddingTop: 'none',
        marginBottom: '-.1em',
        marginTop: '-.8em',
    },
    box4: {
        display: 'inline-block',
        width: '50%',
        paddingTop: 'none',
        marginBottom: '-.1em',
        marginTop: '-.8em',
    },
  list:{
    paddingLeft: '.1em',
  },
  flexContainer: {
    display: 'flex',
    justifyContent: 'left',
    justifyContent: 'space-between',
    paddingRight: '1.5em',
  },
  flexContainer2: {
    display: 'flex',
    justifyContent: 'left',
    justifyContent: 'space-between',
    paddingRight: '2em',
  },
  notShown: {
    display: 'none',
  },
  safetyLevel:{
    backgroundColor: 'WhiteSmoke',
      color: 'white', 
      borderRadius: 3
    },  
});

 

class MainList extends React.Component{
    constructor(props) {
        super(props);
        this.state = { 
          sendScore: 0,
          messageScore: 0,
          linkScore: 0, 
          attachmentScore: 0,
          totVal: 0,
          safetyType: '', 
          alert: 'NO',
        };
    }


    componentDidMount(){
      this.getData();
    }

    //handlers that fetches percent score evaluation from the other components:

    handleMessage = (messageValue) => {
      this.setState({messageScore: messageValue});
      this.progBar(messageValue, "content");
    }

    handleSender = (senderValue) => {
      this.setState({sendScore: senderValue});
      this.progBar(senderValue, "send");
    }
    handleLink = (linkValue) => {
      this.setState({linkScore: linkValue});
      this.progBar(linkValue, "links");
    }
    handleAttachment = (attachmentValue) => {
      this.setState({attachmentScore: attachmentValue});
      this.progBar(attachmentValue, "attachment");
    }
 

    handleAttributeValues = (messageValue, senderValue, linkValue, attachmentValue) => {
      this.setState({ 
        messageScore: messageValue,
        senderScore: senderValue,
        linkScore: linkValue,
        attachmentScore: attachmentValue,
      });
    }



    //Delaying fetching the data to get the right calculation.
    getData = async () => {
      setTimeout(() => {
          this.totEvaluation(this.state.sendScore,this.state.messageScore, this.state.linkScore, this.state.attachmentScore);
      }, 800)
    }
    
    //Total evaluation of all the fetched evaluation percent scores
    totEvaluation = async (a,b,c,d) => {
      console.log(a,b,c,d);
      var numA = parseInt(a);
      var numB = parseInt(b);
      var numC = parseInt(c);
      var numD = parseInt(d);
      var value = ((numA + numB + numC + numD) / 4);
      let self = this;
      var roundedScore = value.toFixed(0);
      self.setState({
        totVal: roundedScore,
      });
      self.progBar(roundedScore, "tot_ev");
      self.progBar(roundedScore, "safetyLevel");
      console.log(this.state.totVal);   
    }

    //Giving colour to percent bar based on percent score.
    progBar = async (c, text) => {
        var elem = document.getElementById(text);
        var elem1 = document.getElementById('alert');

      var width = c;
        elem.style.width = "100%";
        elem1.style.width = "100%";
        if(width <= 75){
            elem.style.backgroundColor = "#e91e63";
            elem1.style.backgroundColor = "#ffebee";
            elem1.style.color = 'black';
            elem1.style.padding = '1em';
            elem1.style.marginBottom = '1em';
            elem1.style.position = 'relative';
            elem1.style.borderLeft = '4px solid red';
            elem1.textContent = 'We do NOT trust the safety of this email.';

          this.setState({safetyType: 'NO'}); 
        } else if(width > 75){
            elem.style.backgroundColor = "#009688";
            elem1.style.backgroundColor = "#e8f5e9";
            elem1.style.color = 'black';
            elem1.style.padding = '1em';
            elem1.style.marginBottom = '1em';
            elem1.style.position = 'relative';
            elem1.style.borderLeft = '4px solid green';
            elem1.innerHTML = '<div>We trust the safety of this email.</div>' 
          this.setState({safetyType: 'HIGH'});
      }
    }  

    render(){
      const { classes } = this.props;
      return ( 
          <div className={classes.root}> 
              <p id="alert">Alert!</p>  
              <div className={classes.flexContainer}> 
                  <div style={{marginBottom:'1em'} }>
            <Typography  variant="h6" component="h4">
                          <SecurityIcon className={classes.wrapIcon} />  Email Trust Score   
            </Typography>
            </div>
            <div>
                      <MouseOverPopover className={classes.wrapIcon} tekst="The overall email trust score is determined by a range of contributing factors related to the possibility of a phishing attack; The nature of the sender, email content (including links) and attachments are all key contributing factors considered when the Phish Alert system evaluates the safety of an email. Each of these factors will influence the final score with varying severity depending on their importance to the evaluation process."
                       />
            </div>
              </div>
               
               
              <Paper variant='outlined' className={classes.paper} component={Link} to="/sender"   >
                  <div className={classes.box1}>
                      <p size="small">Sender</p>
                  </div>
                  
                  <div className={classes.box2}>
                      <div className={classes.prosentOnBar}>
                          <div className={classes.bar} id="send"><p><b>{this.state.sendScore}%</b></p></div>
                      </div>
                  </div> 
              </Paper>
              

              <Paper variant='outlined' className={classes.paper} component={Link} to="/content"> 
                <div className={classes.box1}>
                    <p size="small">Content</p>
                </div>
                <div className={classes.box2}>
                    <div className={classes.prosentOnBar}>
                <div className={classes.bar} id="content"><p><b>{this.state.messageScore}%</b></p></div>
                </div>
                  </div> 
              </Paper>


              <Paper variant='outlined' className={classes.paper} component={Link} to="/links">  
                <div className={classes.box1}>
                    <p size="small">Links</p> 
                </div>
                <div className={classes.box2}>
                    <div className={classes.prosentOnBar}> 
                        <div className={classes.bar} id="links"><p><b>{this.state.linkScore}%</b></p></div>
                    </div>
                </div>
              </Paper>

              <Paper variant='outlined' className={classes.paper} component={Link} to="/attachments">  
                <div className={classes.box1}>
                    <p size="small">Attachments</p> 
                </div>
                <div className={classes.box2}>
                     <div className={classes.prosentOnBar}>
                    <div className={classes.bar} id="attachment"><p><b>{this.state.attachmentScore}%</b></p></div>
                    </div>
                </div>
              </Paper>

            
              <div className={classes.cont}>
               
                <div className={classes.box3}><p><b>Total Trust Score</b></p></div>
                  <div className={classes.box4}>
                    <div className={classes.prosentOnBar}>
                    <div className={classes.bar} id="tot_ev"><p><b>{this.state.totVal}%</b></p></div>
                  </div>
                </div>
                <div className={classes.safetyBar}>
                  <div className={classes.safetyLevel} id="safetyLevel"><p><b>{this.state.safetyType} SAFETY</b></p></div>
                </div>
              </div> 
         
        <div className={classes.notShown}> 
            <Content onMessageScore={this.handleMessage}/>
            <Sender onSenderScore={this.handleSender}/>
            <Links onLinkScore={this.handleLink}/>
            <Attachment onAttachmentScore={this.handleAttachment}/>
          </div>
        </div>
    );
    }
}

MainList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(MainList);