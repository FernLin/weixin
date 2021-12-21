// 需要在使用该组件的页面添加<van-toast id="van-toast" />，方可显示toast
import Toast from "@vant/weapp/toast/toast"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    value: {
      type: Number,
      default: 0,
    },
    base: {
      type: Number,
      default: 0,
    },
    countFormatter: Function,
    step: {
      type: Number,
      default: 1,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 0,
    },
    maxMsg: {
      type: String,
      default: '超出预约上限，转线下网点预约！',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    leftIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAADqElEQVR4Ae2cPWhTURTHz3mpba0FLTr0wylGBOvUNkixi0un2EVw11VQFBzFiKNgcXHUXXDRTB2cKsXGdosglrrYD0GpgpY0Nrmec9NXk+Y+T4cX9b13HoTknf/Nfe/8+r/3JqT3IAQcn8fHhyqV7YsGTA4AMwZgAIzpDmgerTBiGQHWAMwSAhY6OzueHZubW3ElQe2aj68TE33fN8u3KXqVHp3NamzPtiizR7093feOzM5uNGbZBGgtmx2u1uA5OSXd2CgxrxGXUx5MDRSLJT/nXUB1OOYVGDjsi4l8RviW8vCcD8ljCDys6s5JOByGQQZhFsyETy0gO+ckdVgxhb0HsdiZhwF5tSpv/VymNu4Jmccl4t0a1F4P5nLvMZ+v7e0vauefstn0tsHzNNfeMsacCrj/SnfXgTSujmav1Yx56GqEiE8R+i8PLrzYdOlRj61PTh6qftl4TJAuuXLxEK979c85rTLBeZc62nclrnA44/6ZmR9sAKBR0kqApyOTozkIMy6R3nSfO3BqMQqyAXgKcaeEGXIQfUJ2HPR54KUjHMsQz6+uxJiNF/T1oX9+/oPrTXGM8eLjzIu+Wtll3ikmKPinlVkBCUZQQApIICDI6iAFJBAQZHWQAhIICLI6SAEJBARZHaSABAKCrA5SQAIBQVYHKSCBgCCrgxSQQECQ1UEKSCAgyB2Cvm95ZSRbot+RTu/7DW1oSL/llYYWimfC7Dq0Ifav4TAU+oV0OEw43FdogMK+sf+lPwUk/CUU0N8CRP8M+Va4VtvldtxDaKvY0GIx9Amy7UT3cQEdYgIkBaSABAKCrA5SQAIBQVYHKSCBgCCrgxSQQECQ1UEKSCAgyOogBSQQEGR1kAISCAiyOkgBCQQEWR2kgAQCgqwOUkACAUEOdJDJ5wM1oc9YyR7tTS27MlotFE664nGM8TZxZ17ExqPaFFQFpfXwwDvbGo1nxO6hd6TGbGgYmSWHBlVj7qyOXuhxaXGK8d55LjDgzskskYOw4BSpPIOB9Se2A2eD6AfZADuFBZzVF5iNWJqCCwzwHnreJh6HndC8+PD8ylMIjxJyj3v+Adii0hQnbHmcjyNjD8gPN6LviVAzmD6++OamXcq58lJQeYZQLxmVzqhUhWVC92sBcVkqrrwEVFwoKjm07T5tgSWY8kt1WUB8Ma64xJWXEu0kW6Lrd/Up5rILyIfUe7BrjF5P06PCsYQcnOs05+6X5vLztpO0f9L4rGUC6zR+AScfESzOpy/kAAAAAElFTkSuQmCC',
    rightIcon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAASKADAAQAAAABAAAASAAAAACQMUbvAAAEI0lEQVR4Ae2cPUwUURCA5y0IiCRKtODHClELO+4uSqSxoUJiNLHX1kSjiT+N8YyNxERiY6m9iTFRKgorDApiZ4ESbDzARIMmSo4T7jmzsPjubpYhxyLe3mxyubcz7+2++TJv3v69MRCyfe3ubs/lls5YsH0AptMCtIK1DSHVK0tsTNYAzALYKQNmqK6u9um+0dEMZwTWK9y+9/Q0/1zI3kTpBfzVFWpju7eIlj1samy4s2dkZN61sgDQbCp1ZDkPz9FTOtxKVVM2ZrrGg/7W8fH3gc1rgFbg2FdgYXegrMp/Az9qPHM8gOQRBBpWK55T5XAIBjoIsSAmtOsD8mNOtQ4rolC8IYvVOAyGZqvs4u9prMMHZBqXxtzOQ/5NW1/fR5NO54uPV2n7X1KpjiVrTmCsvWqtPRzS/1xD/Y4OM5NIXcxb+4CrZIx5YqDlXNvEiwVOX+myud7eXcvf5h8hpLOcLZ4xl7yV65xSNcKZrNnbfD6ucMjiluHhX+QAgKOklACFI9uHMch0ckpsdI8OwOpiJCQHoBDCm2Q60YPwCpnZ8HrgJSOOpYjiK2cYsfHCbh9axsY+cY3iKKPJh7ULb638aZ5VVpFwvZlZAQmOoIAUkEBAUKsHKSCBgKCuFfRbrs50JQfweuOaeyK8ih9onxi/4cq2q7z9Q8zAIcZ4TsZU23rR9gPaehs3dQYFJOBTQApIICCo1YMUkEBAUKsHKSCBgKBWD1JAAgFBrR6kgAQCgjqyu/lMInUX3ySFvaUM7QbeyR8tVuL7qGOZRPJZsVzeN5NRPwWIDBC+nbwuG7DBGhZaEdypDdZ2qmErgEgfk2gMcvByRQXEUXFkCsiBwRUji0H0mLTsII0xp6BzBmbx0zf2dXBBvZIdM1ki2qQgMkDlzh40WxUHZPzy9DUe7/QmbYukuQ4xAaMCUkACAUGtHqSABAKCWj1IAQkEBLV6kAISCAhq9SAFJBAQ1OpB/z8g9g78g9Dvf6aO7G6+3B6vPgWI9DFpuX3h2ukQ46g4MgXkwOCKCoij4sgUkAODKyogjoojU0AODK6ogDgqjiwUkE2nQ3VO+9gXPVybmuWsnBkaOsjJ4yijZeKsXcjGwxd0mAWldPPAK/nqorRWPCT+GnrGFGKDw8hOMTpYtvbWTOJkI6eLk4zWzlOCAd4mO4UeZIZYJaZnsDD32D8AW6HyheQAq4kF2O+aiI2YmoISDNAaelomHoeV0DT5UHylEEKjZJ1UQIuYmuIADjOAz13J+/h3ufJ9IlILBve/e3vFn8op81JYeoZIT1kpB8NUFT4T7K8PiNJSUeYlwORClWLDlvXTT7AE/UGqLh8QnYwyLlHmpar2JD9F19/sU8RlDVAAqWlnfRLLg/jLkaxKNrJ1kGwPUnMFdvtBOthx/zVN4AqNP99bLYLGb7gpAAAAAElFTkSuQmCC',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    letBtnClick() {
      let value;
      if (this.data.step >= 1) {
        value = Math.ceil(this.data.value - this.data.step);
      } else {
        value = (this.data.value - this.data.step).toFixed(1);
      }
      if (this.data.min > value) {
        Toast('已至最小！');
        return;
      }
      this.triggerEvent('change', {
        base: this.data.base,
        count: value,
        amount: value * this.data.base
      });
    },
    rightBtnClick() {
      let value;
      if (this.data.step >= 1) {
        value = Math.ceil(this.data.value + this.data.step);
      } else {
        value = (this.data.value + this.data.step).toFixed(1);
      }
      if (this.data.max && value > this.data.max) {
        Toast(this.data.maxMsg);
        return;
      }
      this.triggerEvent('change', {
        base: this.data.base,
        count: value,
        amount: value * this.data.base
      });
    },
  }
})