import {Ionicons} from '@expo/vector-icons';
import {useLocalSearchParams,useRouter} from 'expo-router';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView,useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  DEFAULT_TARGET_SCORE,
  DEFAULT_THEME,
  Round,
  ROUTES,
  Theme,
  THEMES,
} from './constants/app_const';

export default function RezultatScreen() {
  const router=useRouter();
  const insets=useSafeAreaInsets();

  const params=useLocalSearchParams<{
    rounds?: string;
    targetScore?: string;
    gamesMi?: string;
    gamesVi?: string;
    theme?: Theme;
  }>();

  const rounds: Round[]=params.rounds? JSON.parse(params.rounds):[];
  const targetScore=Number(params.targetScore||DEFAULT_TARGET_SCORE);
  const gamesMi=Number(params.gamesMi||0);
  const gamesVi=Number(params.gamesVi||0);
  const theme=params.theme||DEFAULT_THEME;

  const COLORS=THEMES[theme];
  const styles=createStyles(COLORS,insets.bottom);

  const totalMi=rounds.reduce((sum,round) => sum+round.mi,0);
  const totalVi=rounds.reduce((sum,round) => sum+round.vi,0);

  const hasWinner=totalMi>=targetScore||totalVi>=targetScore;

  let displayedRounds=rounds;
  let displayedTotalMi=totalMi;
  let displayedTotalVi=totalVi;
  let displayedGamesMi=gamesMi;
  let displayedGamesVi=gamesVi;

  if(hasWinner) {
    if(totalMi>=targetScore&&totalMi>=totalVi) {
      displayedGamesMi=gamesMi+1;
    } else if(totalVi>=targetScore&&totalVi>totalMi) {
      displayedGamesVi=gamesVi+1;
    }

    displayedRounds=[];
    displayedTotalMi=0;
    displayedTotalVi=0;
  }

  const getNavigationParams=() => ({
    rounds: JSON.stringify(displayedRounds),
    targetScore: String(targetScore),
    gamesMi: String(displayedGamesMi),
    gamesVi: String(displayedGamesVi),
    theme,
  });

  const goToInput=() => {
    router.push({
      pathname: ROUTES.unos,
      params: getNavigationParams(),
    });
  };

  const goToSettings=() => {
    router.push({
      pathname: ROUTES.postavke,
      params: getNavigationParams(),
    });
  };

  const resetGame=() => {
    router.replace({
      pathname: ROUTES.rezultat,
      params: {
        rounds: JSON.stringify([]),
        targetScore: String(targetScore),
        gamesMi: '0',
        gamesVi: '0',
        theme,
      },
    });
  };

  const newGame=() => {
    Alert.alert(
      'Nova igra',
      'Jeste li sigurni da želite započeti novu igru?',
      [
        {text: 'Odustani',style: 'cancel'},
        {text: 'Započni',style: 'destructive',onPress: resetGame},
      ]
    );
  };

  if(hasWinner) {
    setTimeout(() => {
      router.replace({
        pathname: ROUTES.rezultat,
        params: getNavigationParams(),
      });
    },0);
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={goToSettings}>
          <Ionicons name="settings-outline" size={26} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.gameScoreRow}>
        <View style={styles.gameScoreBox}>
          <Text style={styles.gameScoreLabel}>MI</Text>
          <Text style={styles.gameScoreValue}>{displayedGamesMi}</Text>
        </View>

        <Text style={styles.gameScoreSeparator}>:</Text>

        <View style={styles.gameScoreBox}>
          <Text style={styles.gameScoreLabel}>VI</Text>
          <Text style={styles.gameScoreValue}>{displayedGamesVi}</Text>
        </View>
      </View>

      <View style={styles.scoreCard}>
        <View style={styles.team}>
          <Text style={styles.score}>{displayedTotalMi}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.team}>
          <Text style={styles.score}>{displayedTotalVi}</Text>
        </View>
      </View>

      <Text style={styles.targetText}>Igra do {targetScore}</Text>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>MI</Text>
          <Text style={styles.headerCell}>VI</Text>
        </View>

        <ScrollView>
          {displayedRounds.map(round => (
            <View key={round.id} style={styles.tableRow}>
              <Text style={styles.tableCell}>{round.mi}</Text>
              <Text style={styles.tableCell}>{round.vi}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <TouchableOpacity style={styles.addButton} onPress={goToInput}>
        <Text style={styles.addText}>+ NOVI UNOS</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.newGame} onPress={newGame}>
        <Text style={styles.newGameText}>NOVA IGRA</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const createStyles=(COLORS: typeof THEMES.light,bottomInset: number) => {
  const isAndroid=Platform.OS==='android';

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    topBar: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      paddingTop: isAndroid? 6:18,
      paddingHorizontal: 20,
    },

    gameScoreRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 4,
      marginBottom: 6,
    },

    gameScoreBox: {
      alignItems: 'center',
      minWidth: 52,
    },

    gameScoreLabel: {
      color: COLORS.text,
      fontSize: 12,
      fontWeight: '500',
    },

    gameScoreValue: {
      color: COLORS.text,
      fontSize: 22,
      fontWeight: '700',
    },

    gameScoreSeparator: {
      color: COLORS.text,
      fontSize: 22,
      fontWeight: '600',
      marginHorizontal: 8,
      marginTop: 12,
    },

    scoreCard: {
      backgroundColor: COLORS.primaryTransparent,
      marginHorizontal: 20,
      marginTop: 8,
      marginBottom: 8,
      borderRadius: 20,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: isAndroid? 20:25,
    },

    team: {
      alignItems: 'center',
      flex: 1,
    },

    score: {
      fontSize: 40,
      color: COLORS.text,
      fontWeight: '600',
    },

    divider: {
      width: 1,
      height: 60,
      backgroundColor: COLORS.dark,
    },

    targetText: {
      textAlign: 'center',
      color: COLORS.text,
      fontSize: 14,
      marginBottom: 10,
    },

    table: {
      flex: 1,
      marginHorizontal: 20,
      marginBottom: isAndroid? 6:10,
    },

    tableHeader: {
      flexDirection: 'row',
      backgroundColor: COLORS.primary,
      paddingVertical: 10,
    },

    headerCell: {
      flex: 1,
      textAlign: 'center',
      color: COLORS.text,
      fontSize: 18,
      fontWeight: '700',
    },

    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingVertical: 10,
    },

    tableCell: {
      flex: 1,
      textAlign: 'center',
      color: COLORS.text,
      fontSize: 20,
    },

    addButton: {
      backgroundColor: COLORS.dark,
      padding: isAndroid? 21:25,
      alignItems: 'center',
    },

    addText: {
      color: COLORS.white,
      fontWeight: '600',
      fontSize: 20,
    },

    newGame: {
      alignSelf: 'center',
      marginTop: isAndroid? 8:10,
      marginBottom: isAndroid? 4:10,
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: COLORS.dark,
      backgroundColor: COLORS.white,
    },

    newGameText: {
      color: COLORS.text,
      fontWeight: '500',
    },
  });
};