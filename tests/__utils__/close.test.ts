import { ok } from 'assert';
import { it, test } from 'vitest';
import { spy } from 'sinon';
import { close, exitScript } from '../../src/utils';

test('close', () => {
  it('should call display.info() and exit with code 1 when given 0', () => {
    const infoSpy = spy();
    const exitSpy = spy();

    close(0);

    ok(infoSpy.calledOnceWith('Gracefully shutting down. Please wait...'));
    ok(exitSpy.calledOnceWith(1));
  });

  it('should call display.warn() and exit with code 0 when given non-zero number', () => {
    const warnSpy = spy();
    const exitSpy = spy();

    close(42);

    ok(warnSpy.calledOnceWith('Force-closing...'));
    ok(exitSpy.calledOnceWith(0));
  });
});

test('exitScript', () => {
  it('should call console() and exit with code 1 when given 0', () => {
    const consoleSpy = spy();
    const exitSpy = spy();

    exitScript(0);

    ok(consoleSpy.calledOnceWith('Script executed successfully! 🎉'));
    ok(exitSpy.calledOnceWith(1));
  });

  it('should call console() and exit with code 0 when given non-zero number', () => {
    const consoleSpy = spy();
    const exitSpy = spy();

    exitScript(42);

    ok(consoleSpy.calledOnceWith('Script ran in some issue 😥'));
    ok(exitSpy.calledOnceWith(0));
  });
});
