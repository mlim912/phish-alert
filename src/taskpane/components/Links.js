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
  linkList:{
    maxHeight: '5.3em',
    overflowY: 'auto',
  }
});

class Links extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          emailAdr: '',
          displayName: '',
          emailLink: '',
          numLinks: 0,
          numRedirect: 0,
          numEncoding: 0,
          linksHTTPS: 0,
          linkArray: [],

          linkRedirectScore: 0,
          linkHttpsScore: 0,
          linkEncodeScore: 0,
          linkDuplicateScore: 0,
          linkScore: 0,
          duplicateLinks: 0,
          totVal: 0,
        };
    }

    componentDidMount(){
      this.getSender();
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
      this.compareName_Email_Links(a,b);
    }

    //Method nomralizes and compares sender's display name and email address
    //with distinct links found in email.
    compareName_Email_Links = async (senderName, senderEmail) => {
      var text_1 = senderName;
      var text_2 = senderEmail;
      let self = this;
      var score = 0;

      var lowerRes_1 = text_1.toLowerCase();
      var lowerRes_2 = text_2.toLowerCase();
      var removeDomain_1 = lowerRes_1.slice(0, lowerRes_1.lastIndexOf("."));
      var removeDomain_2 = lowerRes_2.slice(0, lowerRes_2.lastIndexOf("."));


      var normalize_text_1 = removeDomain_1.replace(/[^a-zA-Z0-9^æøå]/g, ' ');
      var normalize_text_2 = removeDomain_2.replace(/[^a-zA-Z0-9^æåø]/g, ' ');

      var ArrayRes_1 = normalize_text_1.split(" ");
      var ArrayRes_2 = normalize_text_2.split(" ");

      var filterArray_1 = ArrayRes_1.filter(word => word != "" && word.length > 1);
      var filterArray_2 = ArrayRes_2.filter(word => word != "" && word.length > 1);

      Office.context.mailbox.item.body.getAsync(
        "html", function callback(asyncResult) {
          if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          var htmlParser = new DOMParser().parseFromString(asyncResult.value, "text/html");
          var links = htmlParser.getElementsByTagName("a");
          var array = Array.from(links);
          var arrayHref = [];
          var arrayOrigin = [];
          var numHttp = 0;
          var numRedirection = 0;
          var num = 0;
          var numEncode = 0;
          
          var myProfile = Office.context.mailbox.userProfile.displayName;
          //checks if you are the sender of the email -> gives full score.
          if(myProfile == text_1){
            self.setState({
              linkArray: ["You are the sender of the email."],
              numRedirect: 0,
              linksHTTPS: 0,
              numLinks: 0,
              numEncoding: 0,
              linkHttpsScore: 100,
              linkRedirectScore: 100,
              linkEncodeScore: 100,
              linkDuplicateScore: 100,
              linkScore: 100,
              totVal: 100,
            });
            self.progBar(100, "bar_1");
            self.progBar(100, "bar_2");
            self.progBar(100, "bar_3");
            self.progBar(100, "bar_4");
            self.progBar(100, "bar_5");
            self.totEvaluation(100,100,100,100,100);
          }
          //checks if there are 0 links in the email -> if so gives 100 % score.
          else if(array.length <= 0){
            self.setState({
              linkArray: ["No links included in email"],
              numRedirect: 0,
              linksHTTPS: 0,
              numLinks: 0,
              numEncoding: 0,
              linkHttpsScore: 100,
              linkRedirectScore: 100,
              linkEncodeScore: 100,
              linkDuplicateScore: 100,
              linkScore: 100,
              totVal: 100,
            });
            self.progBar(100, "bar_1");
            self.progBar(100, "bar_2");
            self.progBar(100, "bar_3");
            self.progBar(100, "bar_4");
            self.progBar(100, "bar_5");
            self.totEvaluation(100,100,100,100,100);

          }else{
          for(var a = 0; a < array.length; a++){
            arrayHref.push(array[a].href);
            arrayOrigin.push(array[a].origin);
            var url = array[a].search;
            var dec = decodeURIComponent(url);

            if(url != dec){
              numEncode++;
            }
            //checks if links contains https
            if(array[a].protocol == "https:"){
              numHttp++;
            }
            //checks if links contain redirect
            if(array[a].pathname.includes("redirect")){
              numRedirection++;
            }
          }
          //checks if links contain http
          for(var b = 0; b < arrayHref.length; b++){
            num++;
            if(!arrayHref[b].includes('http')){
              arrayHref.splice(b, 1);
              b--;
            }
          }
          //Remove duplicate domain links -> only keep unlik URL's
          const distinct = (value, index, self) => {
            return self.indexOf(value) === index;
          }
          var distinctRes = arrayHref.filter(distinct);
          var distinctDomain = arrayOrigin.filter(distinct);
          var numDupLinks = num - distinctRes.length;
          if(distinctRes.length == 1){
            numDupLinks = num;
          }
          console.log(array);
          //percent of link that have URL encoding
          var numEncodeLinks = (100 - ((numEncode/num)*100)).toFixed(0);
          if(numEncodeLinks < 0){
            numEncodeLinks = 0;
          }
          //percent of links that have https
          var numHttpLinks = ((numHttp/num)*100).toFixed(0);
          //percent of links that redirect
          var numRedirectLinks = (100 - ((numRedirection/num)*100)).toFixed(0);
          //percent of links that are duplicates
          var numDuplicateLinks = (100 - ((numDupLinks/num)*100)).toFixed(0);
          if(numDupLinks <= 1){
            numDuplicateLinks = 100;
          }
          
          self.setState({
            linkArray: distinctDomain,
            numRedirect: numRedirection,
            linksHTTPS: numHttp,
            numLinks: num,
            numEncoding: numEncode,
            linkHttpsScore: numHttpLinks,
            linkRedirectScore: numRedirectLinks,
            linkEncodeScore: numEncodeLinks,
            linkDuplicateScore: numDuplicateLinks,
            duplicateLinks: numDupLinks,
          });

          //iterate through words in email address and compare with words in links
          //matches = + 40 % score
          for(var i = 0; i < filterArray_2.length; i++){
            for(var h = 0; h < distinctRes.length; h++){
              if(distinctRes[h].includes(filterArray_2[i])){
                score += 40;
              }
            }
          }

          //iterate through words in display name and compare with words in links
          //matches = + 40 % socre
          for(var j = 0; j < filterArray_1.length; j++){
            for(var l = 0; l < distinctRes.length; l++){
              if(distinctRes[l].includes(filterArray_1[j])){
                score += 40;
              }
            }
          }

      if(score >= 100){
        score = 100;
        self.setState({
          linkScore: score,
          nameSimilarity: 'Very high name, email and links similarity',
        })
      }else if(score < 100 && score >= 75){
        self.setState({
          linkScore: score,
          nameSimilarity: 'High name, email and links similarity',
        })
      }else if(score < 75 && score >= 50){
        self.setState({
          linkScore: score,
          nameSimilarity: 'Medium name, email and links similarity',
        })
      }else if(score < 50 && score >= 25){
        self.setState({
          linkScore: score,
          nameSimilarity: 'Low name, email and links similarity',
        })
      }else if(score < 25 && score > 0){
        self.setState({
          linkScore: score,
          nameSimilarity: 'Minimal similarity',
        })
      }else if(score == 0){
          self.setState({
            linkScore: score,
            nameSimilarity: 'No similarity',
          });
      }
      self.progBar(score, "bar_1");
      self.progBar(numEncodeLinks, "bar_2");
      self.progBar(numHttpLinks, "bar_3");
      self.progBar(numRedirectLinks, "bar_4");
      self.progBar(numDuplicateLinks, "bar_5");
      var encodedLinksValue = numEncodeLinks*0.2;
      var redirectLinksValue = numRedirectLinks*0.2;
      var duplicateLinksValue = numDuplicateLinks*0.2;
      self.totEvaluation(score, encodedLinksValue, numHttpLinks, redirectLinksValue, duplicateLinksValue);
    }
      }else{
        console.log(asyncResult.error);
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

    //Total evaluation percent score calculation
    totEvaluation = async (a,b,c,d,e) => {
      var numA = parseInt(a);
      var numB = parseInt(b);
      var numC = parseInt(c);
      var numD = parseInt(d);
      var numE = parseInt(e);
      var value = ((numA + (numB) + numC + (numD) + numE) / 2.6);
      if(value >= 100){
        value = 100;
      }
      let self = this;
      var roundedScore = value.toFixed(0);
      self.setState({
        totVal: roundedScore,
      });
      self.progBar(roundedScore, "bar_6");
      self.props.onLinkScore(roundedScore);    
    }

    render(){
      const { classes } = this.props;
    return (
        <div className={classes.root}>
            <Breadcrumbs aria-label="breadcrumb">
                <IconButton className={classes.button} component={Link} to="/" size='small'>
                    <HomeIcon fontSize="inherit" />
                </IconButton>
                <Typography style={{ fontWeight: 'bold', m: 1, color: 'black' }} color="Black">Links</Typography>
            </Breadcrumbs>

      <div className={classes.cards}>  
                <div className={classes.card}>
                    <div className={classes.flexContainer}>
                        <div>
                            <Typography variant="h6" component="h3">
                                Evaluation
                            </Typography>
                        </div>
                        <div>
                            <MouseOverPopover tekst="The final percentage evaluation for the 'links' section is determined primarily by three factors, the assessment of the link sender relation alongside an evaluation of the URL encoding and link security. This percentage reflects the average of all contributing attributes."/>
                        </div>
                    </div>
                    <div className={classes.prosentOnBar}>
                        <div className={classes.bar} id="bar_6"><p><b>{this.state.totVal}%</b></p></div>
                    </div>
                    <p>
                        Total evaluation of link(s) in this email
                    </p>
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
                        <TreeItem nodeId="1" label="Link-Sender relation">
                            <div className={classes.flexContainer}>
                                <div>
                                    <Typography variant="h6" component="h3">
                                        Link-Sender relation
                                    </Typography>
                                </div>
                                <div>
                                    <MouseOverPopover tekst="Typically legitimate businesses have their company name in their display name, email domain and associated links; the absence of this continuity could point to an attempt at fraud."/>
                                </div>
                            </div>
                            <div  >
                                <div  id="bar_1"><p> Score: <b>{this.state.linkScore}%</b></p></div>
                            </div>
                            <p>
                                Display Name:<br /> <b>{this.state.displayName}</b>
                            </p>
                            <p>
                                Email Address:<br /> <b>{this.state.emailAdr}</b>
                            </p>
                            <p>Distinct Link hostname(s):</p>
                            <div className={classes.linkList}>
                                {this.state.linkArray.map(item => (
                                    <ul key={item}><b>{item}</b></ul>
                                ))}
                            </div>
                            <p>Similarity: <b>{this.state.nameSimilarity}</b></p>
                        </TreeItem>

                        <TreeItem nodeId="2" label="URL Encoding">
                            <div className={classes.flexContainer}>
                                <div>
                                    <Typography variant="h6" component="h3">
                                        URL Encoding
                                    </Typography>
                                </div>
                                <div>
                                    <MouseOverPopover tekst="The technique of URL encoding replaces unsafe ASCII characters with a % symbol followed by two hexadecimal digits, this makes it harder to read and is often used to obscure the true location of the link. This technique is typical in both legitimate and illegitimate emails so its impact to the final evaluation is reduced."/>
                                </div>
                            </div>
                            <div>
                                <div id="bar_2"><p>Score: <b>{this.state.linkEncodeScore}%</b></p></div>
                            </div>
                            <p><b>{this.state.numEncoding}</b> of <b>{this.state.numLinks}</b> link(s) contains url encoding</p>
                        </TreeItem>

                        <TreeItem nodeId="3" label="Link Security">
                            <div className={classes.flexContainer}>
                                <div>
                                    <Typography variant="h6" component="h3">
                                        Link Security
                                    </Typography>
                                </div>
                                <div>
                                    <MouseOverPopover tekst="Hypertext Transfer Protocol Secure (HTTPS) is an extension of the Hypertext Transfer Protocol (HTTP). It is used to secure communications over computer networks and is commonplace in most internet domains. The absence of HTTPS is a security vulnerability and will be factored into the final evaluation."/>
                                </div>
                            </div>
                            <div  >
                                <div  id="bar_3"><p>Score: <b>{this.state.linkHttpsScore}%</b></p></div>
                            </div>
                            <p><b>{this.state.linksHTTPS}</b> of <b>{this.state.numLinks}</b> link(s) have https (SSL)</p>
                        </TreeItem>

                        <TreeItem nodeId="4" label="Redirecting Links">
                            <div className={classes.flexContainer}>
                                <div>
                                    <Typography variant="h6" component="h3">
                                        Redirecting Links
                                    </Typography>
                                </div>
                                <div>
                                    <MouseOverPopover tekst="Link redirecting is when a user is sent to a web address different to the initial link that they interacted with. This technique can be used legitimately but is still a security concern and will be factored into the final evaluation."/>
                                </div>
                            </div>
                            <div  >
                                <div id="bar_4"><p>Score: <b>{this.state.linkRedirectScore}%</b></p></div>
                            </div>
                            <p><b>{this.state.numRedirect}</b> of <b>{this.state.numLinks}</b> link(s) contains redirection</p>
                            <p>Ex of redirection in URL: /redirect?z=</p>
                        </TreeItem>

                        <TreeItem nodeId="5" label="Duplication of Links">
                            <div className={classes.flexContainer}>
                                <div>
                                    <Typography variant="h6" component="h3">
                                        Duplication of Links
                                    </Typography>
                                </div>
                                <div>
                                    <MouseOverPopover tekst="It is common for both illegitimate and legitimate emails to contain duplications of a single URL link. Therefore, this factor's impact on the final evaluation is reduced."/>
                                </div>
                            </div>
                            <div >
                                <div id="bar_5"><p>Score: <b>{this.state.linkDuplicateScore}%</b></p></div>
                            </div>
                            <p><b>{this.state.duplicateLinks}</b> of <b>{this.state.numLinks}</b> link(s) are the same</p>
                        </TreeItem>
                    </TreeView>
                </div>
                 
     
    </div> 
    </div>
);
}
}
Links.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(Links);