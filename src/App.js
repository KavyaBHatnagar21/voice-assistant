import React, {useState, useEffect} from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import NewsCards from './components/NewsCards/NewsCards'
import wordsToNumbers from 'words-to-numbers';
import useStyles from './style'

const alanKey = process.env.REACT_APP_API_KEY

export default function App() {
  const [newsArticle, setNewsArticle] = useState([]);
  const [activeArticle, setActiveArticle] = useState(-1);
  const classes = useStyles();

  useEffect(() => {
    alanBtn({
      key: alanKey,
      onCommand: ({command, articles, number }) => {
        if(command === "newHeadlines"){
          console.log(articles);
          setNewsArticle(articles);
          setActiveArticle(-1);
        } else if(command === "highlight"){
          setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
        } else if(command === "open"){
          const parsedNumber = number.length > 2 ? wordsToNumbers(number, {fuzzy: true}) : number;
          const article = articles[parsedNumber - 1];

          if(parsedNumber > 20){
            alanBtn().playText("please try that again")
          } else if(article){
            window.open(article.url, "_blank");
            alanBtn().playText("opening...")
          }
        }
      }
    })
  }, [])

  return (
    <div>
      <div className={classes.logoContainer}>
        <img src="https://alan.app/voice/images/branding_page/logo-horizontal/color/alan-logo-horizontal-color.png" className={classes.alanLogo} alt="alan logo" />
      </div>
      <NewsCards articles={newsArticle} activeArticle={activeArticle} />
      <footer>
        &copy; Made with ❤ by Kavya 2021 
      </footer>
    </div>
  )
}
