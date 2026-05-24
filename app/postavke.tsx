import {useLocalSearchParams,useRouter} from 'expo-router';
import React from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const OPTIONS=[501,701,1001];

export default function PostavkeScreen() {
  const router=useRouter();

  const params=useLocalSearchParams<{
    rounds?: string;
    targetScore?: string;
  }>();

  const rounds=params.rounds||'[]';
  const targetScore=Number(params.targetScore||1001);

  const selectTargetScore=(score: number) => {
    router.replace({
      pathname: '/rezultat',
      params: {
        rounds,
        targetScore: String(score),
      },
    });
  };

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
            {OPTIONS.map(option => {
              const isActive=targetScore===option;

              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.option,isActive&&styles.activeOption]}
                  onPress={() => selectTargetScore(option)}
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

          <Text style={styles.description}>
            Odabrani broj bodova koristi se kao cilj igre.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  backButton: {
    paddingTop: 14,
    paddingLeft: 22,
    paddingBottom: 8,
  },

  back: {
    fontSize: 28,
    color: '#334030',
  },

  content: {
    flex: 1,
    paddingHorizontal: 22,
    paddingTop: 6,
  },

  title: {
    fontSize: 28,
    color: '#334030',
    fontWeight: '600',
    marginBottom: 24,
  },

  card: {
    backgroundColor: 'rgba(183,213,175,0.55)',
    borderRadius: 20,
    padding: 18,
  },

  label: {
    fontSize: 16,
    color: '#334030',
    fontWeight: '600',
    marginBottom: 12,
  },

  selector: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#6F8F68',
  },

  optionText: {
    color: '#334030',
    fontSize: 18,
    fontWeight: '700',
  },

  activeOptionText: {
    color: '#FFFFFF',
  },

  description: {
    marginTop: 14,
    color: '#334030',
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.75,
  },
});