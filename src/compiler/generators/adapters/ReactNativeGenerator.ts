import type { FrameworkAdapter } from '../FrameworkAdapter';
import type { GeneratorContext } from '../GeneratorContext';
import type { GeneratedFile } from '../../CompilerContext';

export class ReactNativeGenerator implements FrameworkAdapter {
  public id = 'adapter_react_native';
  public name = 'React Native (Expo Router)';
  public targetFramework = 'react-native';

  public supportsLanguage(lang: string): boolean {
    return lang === 'typescript' || lang === 'javascript';
  }

  public generateProject(context: GeneratorContext): GeneratedFile[] {
    const ir = context.ir;
    const files: GeneratedFile[] = [];

    files.push({
      path: 'package.json',
      type: 'json',
      content: JSON.stringify(
        {
          name: ir.metadata.name.toLowerCase().replace(/\s+/g, '-'),
          version: '1.0.0',
          private: true,
          scripts: {
            start: 'expo start',
            android: 'expo start --android',
            ios: 'expo start --ios',
          },
          dependencies: {
            expo: '~52.0.0',
            react: '18.3.1',
            'react-native': '0.76.5',
            'expo-router': '~4.0.0',
          },
          devDependencies: {
            typescript: '^5.7.0',
          },
        },
        null,
        2
      ),
    });

    files.push({
      path: 'app/_layout.tsx',
      type: 'typescript',
      content: `import { Stack } from 'expo-router';

export default function Layout() {
  return <Stack screenOptions={{ headerStyle: { backgroundColor: '#0f172a' }, headerTintColor: '#fff' }} />;
}`,
    });

    files.push({
      path: 'app/index.tsx',
      type: 'typescript',
      content: `import { View, Text, StyleSheet } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>VisualStack React Native App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', justifyContent: 'center', alignItems: 'center' },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
});`,
    });

    return files;
  }
}
