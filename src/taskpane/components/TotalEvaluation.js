import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import MouseOverPopover from './MouseOverPopover';


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
  },
});

class TotalEvaluation extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          high: 76, 
          low: 30, 
        };
    }

    componentDidMount(){
      this.getValues();
    }

    //get percent score interval values
    getValues = async () => {
      this.progBar(this.state.high, "bar_1"); 
      this.progBar(this.state.low, "bar_2"); 
    }

    //Giving colour to percent bar based on percent score.
    progBar = async (c, text) => {
        var elem = document.getElementById(text);
        var width = c;
        elem.style.width = "100%";
          if(width <= 50){
              elem.style.backgroundColor = "#FF5555";
          } else if(width > 50){
            elem.style.backgroundColor = "#7ED957";
        }
      }
    
    render(){
      const { classes } = this.props;
    return (
        <div className={classes.root}>
          <div className={classes.cards}>
          <Typography variant="h6" component="h3">
            Total Evaluation
            </Typography>
        <Paper className={classes.card}>
        <div className={classes.flexContainer}>
            <div>
            <Typography variant="h6" component="h3">
            High risk
            </Typography>
            </div>
            <div>
            <MouseOverPopover tekst="Low rish do not mean that the email is 100% safe. There can be cases of false positives
            or false negatives. The ratings are ment as a guidance, making users
            more observant and cautious in their email interactions."/>
            </div>
            </div>
            <div className={classes.prosentOnBar}>
              <div className={classes.bar} id="bar_1"><p><b>{this.state.high}%</b></p></div>
            </div>
            <p>
              A percent rating between 51-100 is considere a legitimate email with low risk. 
              This means that the email may not be a phishing email.
            </p>
        </Paper> 
        <Paper className={classes.card}>
        <div className={classes.flexContainer}>
            <div>
            <Typography variant="h6" component="h3">
            Low risk
            </Typography>
            </div>
            <div>
            <MouseOverPopover tekst="High risk means that many email attributes did not meet the expected critierias.
            These criterias should be checked and considered."/>
            </div>
            </div>
            <div className={classes.prosentOnBar}>
              <div className={classes.bar} id="bar_2"><p><b>{this.state.low}%</b></p></div>
            </div>
            <p>
              A percent rating between 0-50 is considere to have high risk. 
              This means that the email is likely to be a phishing email, and should be looked through closely.
            </p>
        </Paper>
         
        </div>
            <Button variant="outlined" color="gray" className={classes.button} component={Link} to="/">
        Go back
      </Button>
        </div>
    );
    }
}

TotalEvaluation.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(useStyles)(TotalEvaluation);