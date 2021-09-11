import React from 'react'
import { StyleSheet, View, TextInput, Button, Text, FlatList, ActivityIndicator } from 'react-native'
import FilmList from './FilmList'
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi'
import { connect } from 'react-redux'

class Search extends React.Component {

    _searchFilms() {
        // Ici on va remettre à zéro les films de notre state
        this.page = 0
        this.totalPages = 0
        this.setState({
          films: [],
        }, () => { 
            this._loadFilms() 
        })

    }

    state = { 
        films: [],
        isLoading: false, // Par défaut à false car il n'y a pas de chargement tant qu'on ne lance pas de recherche
        isExisting: true
     }

     constructor(props){
       super(props)
       this._loadFilms = this._loadFilms.bind(this)
     }
  
    page = 0 // Compteur pour connaître la page courante
    totalPages = 0 // Nombre de pages totales pour savoir si on a atteint la fin des retours de l'API TMDB

    searchedText = ""

     _searchTextInputChanged(text) {
        this.searchedText = text
    }

    _loadFilms() {
        if (this.searchedText.length > 0) { // Seulement si le texte recherché n'est pas vide
            this.setState({ isLoading: true }) // Lancement du chargement
            getFilmsFromApiWithSearchedText(this.searchedText, this.page+1).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages      
                 if (data.results.length !== 0) {
                    this.setState({ 
                        films: [ ...this.state.films, ...data.results ],
                        isLoading: false,// Arrêt du chargement
                        isExisting: true 
                     })
                 } else {
                    this.setState({ 
                        films: [],
                        isLoading: false, // Arrêt du chargement
                        isExisting: false
                     })
                 }
            })
          }           
    }

    _displayDetailForFilm = (idFilm) => {
        this.props.navigation.navigate('FilmDetail', { idFilm: idFilm })
      }
    

    _displayExisting(){
        if (!this.state.isExisting) {
            return (
              <View style={styles.existing_container}>
                <Text style={styles.existing}> Oups..., Nous n'avons trouvé aucun film correspondant à cette recherche :(</Text>
              </View>
            )
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
          return (
            <View style={styles.loading_container}>
              <ActivityIndicator size='large' color='#E50914' />
              {/* Le component ActivityIndicator possède une propriété size pour définir la taille du visuel de chargement : small ou large. Par défaut size vaut small, on met donc large pour que le chargement soit bien visible */}
            </View>
          )
        }
      }
  
  render () {
    return (
        <View style={styles.main}>
            {/* <Text style={styles.text}>The Movies App</Text> */}
          <View style={{padding: 7.5}}>
            <TextInput style={styles.input} 
            placeholder='Titre du film'
            placeholderTextColor= '#fff' 
            onChangeText={(text) => this._searchTextInputChanged(text)} 
            onSubmitEditing={() => this._searchFilms()} // Effectuer la recherche grace a l'envoie du clavier
            />
            {/* <TextInput style={styles.input} placeholder='Titre du film' onChangeText={(text) => this._searchTextInputChanged(text)} onChange={() => this._loadFilms()} /> */}
            <Button title='Rechercher' onPress={() => this._searchFilms()} color='#E50914'/>
          </View>
          <FilmList
          films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
          navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
          loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
          page={this.page}
          totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
          favoriteList={false}
        />

          {this._displayExisting()}
          {this._displayLoading()}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: '#111'
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    fontWeight: 'bold',
    color: '#fff'
  },
  input : {
    borderStyle: 'solid',
    borderColor: '#E50914',
    borderWidth: 2,
    padding: 5,
    marginBottom: 10,
    borderRadius: 10,
    fontWeight: 'bold',
    color: '#fff'
  },
  loading_container: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  existing_container: {
    position: 'absolute',
    flex: 1,
    left: 0,
    right: 0,
    top: 100,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  existing: {
      fontSize: 25,
      padding: 15,
      fontWeight: 'bold',
      color: '#fff',
      justifyContent: 'center',
      alignContent: 'center',
  }
})

// On connecte le store Redux, ainsi que les films favoris du state de notre application, à notre component Search
const mapStateToProps = state => {
  return {
    favoritesFilm: state.favoritesFilm
  }
}

export default connect(mapStateToProps)(Search)

// const DATA = [
//     {
//        id:181801,
//        vote_average:9.6,
//        title:"CASA DE PAPEL",
//        poster_path:"../Src/casadepapel.jpg",
//        overview:"Un criminel a un plan pour effectuer le plus grand vol de l'histoire, à effectuer à la Monnaie royale d'Espagne. Pour accomplir ses objectifs, l'homme recrute huit personnes qui n'ont rien à perdre.",
//        release_date:"2 MAI 2017"
//     },
//     {
//        id:181802,
//        vote_average:8.6,
//        title:"CONTROL Z",
//        poster_path:"../Src/controlz.jpg",
//        overview:"Dans un lycée mexicain, l'adolescente Sofia, avec peu d'amis mais une excellente intuition, entreprend, avec l'aide du nouveau venu et de son ami Javier, de découvrir l'identité anonyme d'un hacker qui menace de révéler les secrets de tous les élèves du lycée. l'école, y compris celle de Sofia. La première victime des travaux de ce hacker est la belle et populaire Isabela, dont le téléphone portable est piraté puis son secret sort : celui d'être une fille transgenre, un secret qui secoue toute l'école. De là, les amitiés meurent et les rancunes surgissent et le chaos éclate.",
//        release_date:"22 MAI 2020"
//     },
//     {
//         id:181803,
//         vote_average:9.2,
//         title:"Mr ROBOT",
//         poster_path:"../Src/mrrobot.jpg",
//         overview:"Elliot Alderson est un technicien informatique déprimé et toxicomane. Guidé et inspiré par M. Robot, personnage ambigu et mystérieux, il mène un combat contre la tyrannie des sociétés financières.",
//         release_date:"24 JUIN 2015"
//      },
//      {
//         id:181804,
//         vote_average:9.4,
//         title:"PREASON BREAK",
//         poster_path:"../Src/prisonbreak.jpg",
//         overview:"Michael Scofield décide de se faire arrêter exprès pour pouvoir entrer dans la prison de Fox River, où son frère a été emprisonné à tort. Son but est de concevoir une évasion de l'intérieur.",
//         release_date:"29 AOUT 2005"
//      },
//      {
//         id:181805,
//         vote_average:9.5,
//         title:"MENTALIST",
//         poster_path:"../Src/mentalist.jpg",
//         overview:"Patrick Jane, consultant au California Bureau of Investigation, utilise ses compétences d'observation raffinées pour résoudre des cas et attraper le tueur de sa femme et de sa fille.",
//         release_date:"28 SEPTEMBRE 2008"
//      },
//  ]
