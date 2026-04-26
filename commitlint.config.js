const { readdirSync } = require('fs');
const { join } = require('path');

// Автоматически получаем список директорий в папке 'packages'
const getPackageScopes = () => {
  const packagesPath = join(__dirname, 'packages');
  try {
    return [
      'root', // ← добавляем для общих изменений
      ...readdirSync(packagesPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)
    ];
  } catch (e) {
    return ['root'];
  }
};

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Делаем scope обязательным для всех типов коммитов, кроме тех, где он не нужен (например, build, ci)
    'scope-empty': [2, 'never'], 
    'scope-enum': [
      2, // Уровень ошибки
      'always',
      // Динамически подставляем список доступных scope
      getPackageScopes()
    ]
  }
};