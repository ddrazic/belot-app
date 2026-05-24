import {useLocalSearchParams,useRouter} from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    DEFAULT_TARGET_SCORE,
    DEFAULT_THEME,
    GAME_OPTIONS,
    ROUTES,
    Theme,
    THEMES,
} from './constants/app_const';

export default function PostavkeScreen() {
  const router=useRouter();

  const params=useLocalSearchParams<{
    rounds?: string;
    targetScore?: string;
    gamesMi?: string;
    gamesVi?: string;
    theme?: Theme;
  }>();

  const rounds=params.rounds||'[]';
  const targetScore=Number(params.targetScore||DEFAULT_TARGET_SCORE);
  const gamesMi=params.gamesMi||'0';
  const gamesVi=params.gamesVi||'0';
  const theme=params.theme||DEFAULT_THEME;

  const COLORS=THEMES[theme];

  const goBackWithSettings=(newTargetScore=targetScore,newTheme=theme) => {
    router.replace({
      pathname: ROUTES.rezultat,
      params: {
        rounds,
        targetScore: String(newTargetScore),
        gamesMi,
        gamesVi,
        theme: newTheme,
      },
    });
  };

  const styles=createStyles(COLORS);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.back}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Postavke</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Igra do</Text>

          <View style={styles.selector}>
            {GAME_OPTIONS.map(option => {
              const isActive=targetScore===option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.option,isActive&&styles.activeOption]}
                  onPress={() => goBackWithSettings(option,theme)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isActive&&styles.activeOptionText,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Način prikaza</Text>

          <View style={styles.selector}>
            <TouchableOpacity
              style={[styles.option,theme==='light'&&styles.activeOption]}
              onPress={() => goBackWithSettings(targetScore,'light')}
            >
              <Text
                style={[
                  styles.optionText,
                  theme==='light'&&styles.activeOptionText,
                ]}
              >
                Svijetli
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option,theme==='dark'&&styles.activeOption]}
              onPress={() => goBackWithSettings(targetScore,'dark')}
            >
              <Text
                style={[
                  styles.optionText,
                  theme==='dark'&&styles.activeOptionText,
                ]}
              >
                Tamni
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const createStyles=(COLORS: typeof THEMES.light) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.background,
    },

    backButton: {
      paddingTop: 14,
      paddingLeft: 22,
      paddingBottom: 8,
    },

    back: {
      fontSize: 28,
      color: COLORS.text,
    },

    content: {
      flex: 1,
      paddingHorizontal: 22,
      paddingTop: 6,
    },

    title: {
      fontSize: 28,
      color: COLORS.text,
      fontWeight: '600',
      marginBottom: 24,
    },

    card: {
      backgroundColor: COLORS.primaryTransparent,
      borderRadius: 20,
      padding: 18,
      marginBottom: 18,
    },

    label: {
      fontSize: 16,
      color: COLORS.text,
      fontWeight: '600',
      marginBottom: 12,
    },

    selector: {
      flexDirection: 'row',
      backgroundColor: COLORS.background,
      borderRadius: 14,
      padding: 5,
    },

    option: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      borderRadius: 11,
    },

    activeOption: {
      backgroundColor: COLORS.dark,
    },

    optionText: {
      color: COLORS.text,
      fontSize: 16,
      fontWeight: '700',
    },

    activeOptionText: {
      color: COLORS.white,
    },

    description: {
      marginTop: 14,
      color: COLORS.text,
      fontSize: 13,
      lineHeight: 18,
      opacity: 0.75,
    },
  });